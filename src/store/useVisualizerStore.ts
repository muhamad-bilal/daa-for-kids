import { create } from "zustand"
import type { Node, Grid, Algorithm, VisualizerState, AlgorithmInfo } from "../types"
import * as algorithms from "../algorithms"

const GRID_ROWS = 20
const GRID_COLS = 40

const createInitialGrid = (): Grid => {
  const grid: Grid = []
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow: Node[] = []
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push({
        row,
        col,
        type: "empty",
        weight: 1,
        isVisited: false,
        isPath: false,
        distance: Number.POSITIVE_INFINITY,
        fScore: Number.POSITIVE_INFINITY,
        f: Number.POSITIVE_INFINITY,
        previousNode: null,
      })
    }
    grid.push(currentRow)
  }
  return grid
}

const algorithmInfo: Record<Algorithm, AlgorithmInfo> = {
  BFS: {
    name: "Breadth-First Search",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    optimal: true,
    description: "Explores all nodes at the present depth before moving on to nodes at the next depth level.",
    unweighted: true,
    complete: true,
  },
  DFS: {
    name: "Depth-First Search",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    optimal: false,
    description: "Explores as far as possible along each branch before backtracking.",
    unweighted: true,
    complete: true,
  },
  Dijkstra: {
    name: "Dijkstra's Algorithm",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    optimal: true,
    description: "Finds the shortest path from a source node to all other nodes in a weighted graph.",
    weighted: true,
    complete: true,
  },
  "A*": {
    name: "A* Search",
    timeComplexity: "O(b^d)",
    spaceComplexity: "O(b^d)",
    optimal: true,
    description: "Uses heuristics to find the shortest path more efficiently than Dijkstra.",
    weighted: true,
    informed: true,
    complete: true,
  },
  Greedy: {
    name: "Greedy Best-First Search",
    timeComplexity: "O(b^m)",
    spaceComplexity: "O(b^m)",
    optimal: false,
    description: "Always expands the node that appears to be closest to the goal.",
    weighted: true,
    informed: true,
  },
  BellmanFord: {
    name: "Bellman-Ford Algorithm",
    timeComplexity: "O(VE)",
    spaceComplexity: "O(V)",
    optimal: true,
    description: "Can handle negative weights and detect negative cycles.",
    weighted: true,
    complete: true,
  },
  FloydWarshall: {
    name: "Floyd-Warshall Algorithm",
    timeComplexity: "O(V^3)",
    spaceComplexity: "O(V^2)",
    optimal: true,
    description: "Finds shortest paths between all pairs of vertices.",
    weighted: true,
    complete: true,
  },
  Bidirectional: {
    name: "Bidirectional Search",
    timeComplexity: "O(b^(d/2))",
    spaceComplexity: "O(b^(d/2))",
    optimal: true,
    description: "Simultaneously searches from start and end nodes.",
    unweighted: true,
    complete: true,
  },
  JumpPoint: {
    name: "Jump Point Search",
    timeComplexity: "O(b^d)",
    spaceComplexity: "O(b^d)",
    optimal: true,
    description: "Optimized A* for uniform-cost grids.",
    weighted: true,
    informed: true,
    complete: true,
  },
}

const hasValidPath = (grid: Grid, startNode: Node, endNode: Node): boolean => {
  const visited = new Set<string>()
  const queue: Node[] = [startNode]
  visited.add(`${startNode.row}-${startNode.col}`)

  while (queue.length > 0) {
    const currentNode = queue.shift()!

    if (currentNode === endNode) {
      return true
    }

    const neighbors = getNeighbors(currentNode, grid)
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`
      if (!visited.has(key) && neighbor.type !== "wall") {
        visited.add(key)
        queue.push(neighbor)
      }
    }
  }

  return false
}

const getNeighbors = (node: Node, grid: Grid): Node[] => {
  const neighbors: Node[] = []
  const { row, col } = node

  if (row > 0) neighbors.push(grid[row - 1][col])
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col])
  if (col > 0) neighbors.push(grid[row][col - 1])
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1])

  return neighbors
}

const generateRandomMap = (): Grid => {
  let newGrid: Grid
  let startNode: Node
  let endNode: Node
  let attempts = 0
  const MAX_ATTEMPTS = 50

  do {
    newGrid = []
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Node[] = []
      for (let col = 0; col < GRID_COLS; col++) {
        // 15% chance of wall, 15% chance of weight, 70% chance of empty
        const random = Math.random()
        const type = random < 0.15 ? "wall" : random < 0.3 ? "weight" : "empty"
        const weight = type === "weight" ? Math.floor(Math.random() * 5) + 1 : 1

        currentRow.push({
          row,
          col,
          type,
          weight,
          isVisited: false,
          isPath: false,
          distance: Number.POSITIVE_INFINITY,
          fScore: Number.POSITIVE_INFINITY,
          f: Number.POSITIVE_INFINITY,
          previousNode: null,
        })
      }
      newGrid.push(currentRow)
    }

    // Place start and end nodes in empty cells
    let startRow, startCol, endRow, endCol
    do {
      startRow = Math.floor(Math.random() * GRID_ROWS)
      startCol = Math.floor(Math.random() * GRID_COLS)
    } while (newGrid[startRow][startCol].type !== "empty")

    do {
      endRow = Math.floor(Math.random() * GRID_ROWS)
      endCol = Math.floor(Math.random() * GRID_COLS)
    } while ((endRow === startRow && endCol === startCol) || newGrid[endRow][endCol].type !== "empty")

    startNode = {
      row: startRow,
      col: startCol,
      type: "start",
      weight: 1,
      isVisited: false,
      isPath: false,
      distance: 0, // Start node should have distance 0
      fScore: Number.POSITIVE_INFINITY,
      f: Number.POSITIVE_INFINITY,
      previousNode: null,
    }

    endNode = {
      row: endRow,
      col: endCol,
      type: "end",
      weight: 1,
      isVisited: false,
      isPath: false,
      distance: Number.POSITIVE_INFINITY,
      fScore: Number.POSITIVE_INFINITY,
      f: Number.POSITIVE_INFINITY,
      previousNode: null,
    }

    newGrid[startRow][startCol] = startNode
    newGrid[endRow][endCol] = endNode

    attempts++
    if (attempts >= MAX_ATTEMPTS) {
      // If we can't find a valid path after many attempts, reduce wall density
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          if (newGrid[row][col].type === "wall" && Math.random() < 0.5) {
            newGrid[row][col].type = "empty"
          }
        }
      }
      attempts = 0
    }
  } while (!hasValidPath(newGrid, startNode, endNode))

  return newGrid
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  grid: createInitialGrid(),
  startNode: null,
  endNode: null,
  isRunning: false,
  isPaused: false,
  speed: 5, // Changed from 50 to make visualization more visible
  currentAlgorithm: "BFS",
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
    const newGrid = createInitialGrid()
    set({
      grid: newGrid,
      startNode: null,
      endNode: null,
      isRunning: false,
      isPaused: false,
      error: null,
    })
  },
  generateRandomMap: () => {
    const newGrid = generateRandomMap()
    const startNode = newGrid.flat().find((node) => node.type === "start") || null
    const endNode = newGrid.flat().find((node) => node.type === "end") || null
    set({
      grid: newGrid,
      startNode,
      endNode,
      isRunning: false,
      isPaused: false,
      error: null, 
    })
  },

  // Fixed visualization logic
  visualizeAlgorithm: async () => {
    const { currentAlgorithm, startNode, endNode, speed } = get()
    
    if (!startNode || !endNode) {
      set({ error: "Please set both start and end nodes before running the algorithm" })
      return
    }

    try {
      // Reset grid visualization but keep walls and weights
      const resetGrid = get().grid.map(row =>
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
          distance: node.type === "start" ? 0 : Number.POSITIVE_INFINITY,
          fScore: Number.POSITIVE_INFINITY,
          f: Number.POSITIVE_INFINITY,
          previousNode: null,
        }))
      )
      
      set({ grid: resetGrid, error: null })
      
      // Get the algorithm function - normalize the name for import
      const algorithmKey = currentAlgorithm
        .replace(/\*/g, "Star")
        .replace(/\s+/g, "")
        .toLowerCase() as keyof typeof algorithms
      
      const algorithm = algorithms[algorithmKey]
      if (!algorithm) {
        set({ error: `Algorithm '${currentAlgorithm}' not implemented` })
        return
      }

      // Run the algorithm
      const visitedNodesInOrder = await algorithm(resetGrid, resetGrid[startNode.row][startNode.col], resetGrid[endNode.row][endNode.col])
      
      if (!visitedNodesInOrder || visitedNodesInOrder.length === 0) {
        set({ error: "No path found or algorithm did not return nodes" })
        return
      }
      
      // Visualize visited nodes
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        // Check if animation should pause
        if (get().isPaused) {
          await new Promise<void>((resolve) => {
            const checkPaused = () => {
              if (!get().isPaused) {
                resolve()
              } else {
                setTimeout(checkPaused, 100)
              }
            }
            checkPaused()
          })
        }
        
        // Skip if visualization was cancelled
        if (!get().isRunning) return
        
        const node = visitedNodesInOrder[i]
        
        // Get a fresh copy of the grid
        const currentGrid = get().grid;
        const newGrid = [...currentGrid.map(row => [...row])];
        
        // Update the node in the new grid to mark it as visited
        newGrid[node.row][node.col] = {
          ...newGrid[node.row][node.col],
          isVisited: true,
          // Copy the previousNode reference from the node returned by the algorithm
          previousNode: node.previousNode ? 
            currentGrid[node.previousNode.row][node.previousNode.col] : 
            null
        }
        
        set({ grid: newGrid })
        
        // Wait based on speed setting
        await new Promise(resolve => setTimeout(resolve, 1000 / get().speed))
      }

      // Get the shortest path using the updated grid from the store
      const currentGrid = get().grid;
      const endNodeFromGrid = currentGrid[endNode.row][endNode.col];
      const nodesInShortestPathOrder = algorithms.getNodesInShortestPathOrder(endNodeFromGrid);

      // Visualize shortest path
      if (nodesInShortestPathOrder.length > 0) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          // Check if animation should pause
          if (get().isPaused) {
            await new Promise<void>((resolve) => {
              const checkPaused = () => {
                if (!get().isPaused) {
                  resolve()
                } else {
                  setTimeout(checkPaused, 100)
                }
              }
              checkPaused()
            })
          }
          
          // Skip if visualization was cancelled
          if (!get().isRunning) return
          
          const node = nodesInShortestPathOrder[i]
          
          // Use the latest grid
          const newGrid = [...get().grid.map(row => [...row])]
          newGrid[node.row][node.col] = {
            ...newGrid[node.row][node.col],
            isPath: true
          }
          
          set({ grid: newGrid })
          
          // Wait based on speed setting
          await new Promise(resolve => setTimeout(resolve, 1000 / get().speed))
        }
      } else {
        set({ error: "No path found to target" })
      }
    } catch (error) {
      console.error("Algorithm error:", error)
      set({ error: `Error running algorithm: ${error instanceof Error ? error.message : String(error)}` })
    } finally {
      set({ isRunning: false })
    }
  },
}))