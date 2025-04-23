import { create } from 'zustand';
import { Node, Grid, Algorithm, VisualizerState, AlgorithmInfo } from '../types';

const GRID_ROWS = 20;
const GRID_COLS = 40;

const createInitialGrid = (): Grid => {
  const grid: Grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push({
        row,
        col,
        type: 'empty',
        weight: 1,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        fScore: Infinity,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

const algorithmInfo: Record<Algorithm, AlgorithmInfo> = {
  BFS: {
    name: 'Breadth-First Search',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    optimal: true,
    description: 'Explores all nodes at the present depth before moving on to nodes at the next depth level.',
  },
  DFS: {
    name: 'Depth-First Search',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    optimal: false,
    description: 'Explores as far as possible along each branch before backtracking.',
  },
  Dijkstra: {
    name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    optimal: true,
    description: 'Finds the shortest path from a source node to all other nodes in a weighted graph.',
  },
  'A*': {
    name: 'A* Search',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    optimal: true,
    description: 'Uses heuristics to find the shortest path more efficiently than Dijkstra.',
  },
  Greedy: {
    name: 'Greedy Best-First Search',
    timeComplexity: 'O(b^m)',
    spaceComplexity: 'O(b^m)',
    optimal: false,
    description: 'Always expands the node that appears to be closest to the goal.',
  },
  BellmanFord: {
    name: 'Bellman-Ford Algorithm',
    timeComplexity: 'O(VE)',
    spaceComplexity: 'O(V)',
    optimal: true,
    description: 'Can handle negative weights and detect negative cycles.',
  },
  FloydWarshall: {
    name: 'Floyd-Warshall Algorithm',
    timeComplexity: 'O(V^3)',
    spaceComplexity: 'O(V^2)',
    optimal: true,
    description: 'Finds shortest paths between all pairs of vertices.',
  },
  Bidirectional: {
    name: 'Bidirectional Search',
    timeComplexity: 'O(b^(d/2))',
    spaceComplexity: 'O(b^(d/2))',
    optimal: true,
    description: 'Simultaneously searches from start and end nodes.',
  },
  JumpPoint: {
    name: 'Jump Point Search',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d)',
    optimal: true,
    description: 'Optimized A* for uniform-cost grids.',
  },
};

const hasValidPath = (grid: Grid, startNode: Node, endNode: Node): boolean => {
  const visited = new Set<string>();
  const queue: Node[] = [startNode];
  visited.add(`${startNode.row}-${startNode.col}`);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    if (currentNode === endNode) {
      return true;
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key) && neighbor.type !== 'wall') {
        visited.add(key);
        queue.push(neighbor);
      }
    }
  }

  return false;
};

const getNeighbors = (node: Node, grid: Grid): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
};

const generateRandomMap = (): Grid => {
  let newGrid: Grid;
  let startNode: Node;
  let endNode: Node;
  let attempts = 0;
  const MAX_ATTEMPTS = 50;

  do {
    newGrid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Node[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        // 15% chance of wall, 15% chance of weight, 70% chance of empty
        const random = Math.random();
        const type = random < 0.15 ? 'wall' : (random < 0.3 ? 'weight' : 'empty');
        const weight = type === 'weight' ? Math.floor(Math.random() * 5) + 1 : 1;
        
        currentRow.push({
          row,
          col,
          type,
          weight,
          isVisited: false,
          isPath: false,
          distance: Infinity,
          fScore: Infinity,
          previousNode: null,
        });
      }
      newGrid.push(currentRow);
    }
    
    // Place start and end nodes in empty cells
    let startRow, startCol, endRow, endCol;
    do {
      startRow = Math.floor(Math.random() * GRID_ROWS);
      startCol = Math.floor(Math.random() * GRID_COLS);
    } while (newGrid[startRow][startCol].type !== 'empty');
    
    do {
      endRow = Math.floor(Math.random() * GRID_ROWS);
      endCol = Math.floor(Math.random() * GRID_COLS);
    } while ((endRow === startRow && endCol === startCol) || newGrid[endRow][endCol].type !== 'empty');
    
    startNode = {
      row: startRow,
      col: startCol,
      type: 'start',
      weight: 1,
      isVisited: false,
      isPath: false,
      distance: 0, // Start node should have distance 0
      fScore: Infinity,
      previousNode: null,
    };
    
    endNode = {
      row: endRow,
      col: endCol,
      type: 'end',
      weight: 1,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      fScore: Infinity,
      previousNode: null,
    };
    
    newGrid[startRow][startCol] = startNode;
    newGrid[endRow][endCol] = endNode;
    
    attempts++;
    if (attempts >= MAX_ATTEMPTS) {
      // If we can't find a valid path after many attempts, reduce wall density
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          if (newGrid[row][col].type === 'wall' && Math.random() < 0.5) {
            newGrid[row][col].type = 'empty';
          }
        }
      }
      attempts = 0;
    }
  } while (!hasValidPath(newGrid, startNode, endNode));

  return newGrid;
};

export const useVisualizerStore = create<VisualizerState>((set) => ({
  grid: createInitialGrid(),
  startNode: null,
  endNode: null,
  isRunning: false,
  isPaused: false,
  speed: 50,
  currentAlgorithm: 'BFS',
  algorithmInfo,
  error: null,

  setGrid: (grid: Grid) => set({ grid }),
  setStartNode: (node: Node | null) => set({ startNode: node }),
  setEndNode: (node: Node | null) => set({ endNode: node }),
  setIsRunning: (isRunning: boolean) => set({ isRunning }),
  setIsPaused: (isPaused: boolean) => set({ isPaused }),
  setSpeed: (speed: number) => set({ speed }),
  setCurrentAlgorithm: (algorithm: Algorithm) => set({ currentAlgorithm: algorithm }),
  setError: (error: string | null) => set({ error }),
  resetGrid: () => {
    const newGrid = createInitialGrid();
    set({ 
      grid: newGrid,
      startNode: null,
      endNode: null,
      isRunning: false,
      isPaused: false 
    });
  },
  generateRandomMap: () => {
    const newGrid = generateRandomMap();
    const startNode = newGrid.flat().find(node => node.type === 'start') || null;
    const endNode = newGrid.flat().find(node => node.type === 'end') || null;
    set({ 
      grid: newGrid,
      startNode,
      endNode,
      isRunning: false,
      isPaused: false 
    });
  },
})); 