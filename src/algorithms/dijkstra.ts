import { Node, Grid } from '../types';

const getAllNodes = (grid: Grid): Node[] => {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

export const dijkstra = (grid: Grid, startNode: Node, endNode: Node) => {
  const visitedNodesInOrder: Node[] = [];
  const unvisitedNodes = getAllNodes(grid);
  
  // Initialize distances
  unvisitedNodes.forEach(node => {
    node.distance = node === startNode ? 0 : Infinity;
    node.isVisited = false;
    node.previousNode = null;
  });

  while (unvisitedNodes.length > 0) {
    // Sort nodes by distance
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift()!;

    // Skip if we hit a wall
    if (closestNode.type === 'wall') continue;

    // If we're stuck, return visited nodes
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // If we reached the end, return visited nodes
    if (closestNode === endNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
};

const updateUnvisitedNeighbors = (node: Node, grid: Grid) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const newDistance = node.distance + neighbor.weight;
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }
};

const getUnvisitedNeighbors = (node: Node, grid: Grid): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
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