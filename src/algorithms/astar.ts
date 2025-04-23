import { Node, Grid } from '../types';

export const astar = (grid: Grid, startNode: Node, endNode: Node) => {
  const visitedNodesInOrder: Node[] = [];
  const openSet: Node[] = [startNode];
  const closedSet = new Set<string>();
  
  // Reset node states
  grid.forEach(row => {
    row.forEach(node => {
      node.distance = Infinity;
      node.fScore = Infinity;
      node.isVisited = false;
      node.isPath = false;
      node.previousNode = null;
    });
  });
  
  // Initialize start node
  startNode.distance = 0;
  startNode.fScore = getManhattanDistance(startNode, endNode);
  startNode.isVisited = true;
  visitedNodesInOrder.push(startNode);

  while (openSet.length > 0) {
    // Sort nodes by fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
    const currentNode = openSet.shift()!;

    // Skip if we hit a wall
    if (currentNode.type === 'wall') continue;

    // If we reached the end, return visited nodes
    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.type === 'wall' || closedSet.has(`${neighbor.row}-${neighbor.col}`)) {
        continue;
      }

      const tentativeGScore = currentNode.distance + neighbor.weight;
      if (tentativeGScore < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeGScore;
        neighbor.fScore = tentativeGScore + getManhattanDistance(neighbor, endNode);
        neighbor.isVisited = true;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
          visitedNodesInOrder.push(neighbor);
        }
      }
    }

    closedSet.add(`${currentNode.row}-${currentNode.col}`);
  }

  return visitedNodesInOrder;
};

const getManhattanDistance = (nodeA: Node, nodeB: Node): number => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
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