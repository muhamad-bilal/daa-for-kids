import { Node, Grid } from '../types';

export const bfs = (grid: Grid, startNode: Node, endNode: Node) => {
  const visitedNodesInOrder: Node[] = [];
  const queue: Node[] = [];
  const visited = new Set<string>();

  // Get the actual nodes from the grid
  const start = grid[startNode.row][startNode.col];
  const end = grid[endNode.row][endNode.col];

  // Reset node states
  grid.forEach(row => {
    row.forEach(node => {
      node.isVisited = false;
      node.isPath = false;
      node.previousNode = null;
    });
  });

  // Initialize start node
  start.isVisited = true;
  queue.push(start);
  visited.add(`${start.row}-${start.col}`);
  visitedNodesInOrder.push(start);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    if (currentNode === end) {
      return visitedNodesInOrder;
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.row}-${neighbor.col}`;
      if (!visited.has(key) && neighbor.type !== 'wall') {
        neighbor.previousNode = currentNode;
        neighbor.isVisited = true;
        visited.add(key);
        queue.push(neighbor);
        visitedNodesInOrder.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
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

export const getNodesInShortestPathOrder = (endNode: Node): Node[] => {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = endNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}; 