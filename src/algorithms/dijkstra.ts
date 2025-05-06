import { Node, Grid } from '../types';

export const dijkstra = (grid: Grid, startNode: Node, endNode: Node) => {
  const visitedNodesInOrder: Node[] = [];
  const unvisitedNodes = getAllNodes(grid);

  // Get the actual nodes from the grid
  const start = grid[startNode.row][startNode.col];
  const end = grid[endNode.row][endNode.col];

  // Initialize start node
  start.distance = 0;

  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift()!;

    // If we encounter a wall, we skip it
    if (closestNode.type === 'wall') continue;

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop
    if (closestNode.distance === Number.POSITIVE_INFINITY) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode.row === end.row && closestNode.col === end.col) {
      return visitedNodesInOrder;
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
};

const getAllNodes = (grid: Grid): Node[] => {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const sortNodesByDistance = (unvisitedNodes: Node[]) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighbors = (node: Node, grid: Grid) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + neighbor.weight;
    neighbor.previousNode = node;
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