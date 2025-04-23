import { Node } from '../types';

const getHeuristic = (node: Node, endNode: Node): number => {
    // Manhattan distance
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
};

export const greedy = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const openSet = new Set<Node>();
    const closedSet = new Set<string>();
    
    startNode.f = getHeuristic(startNode, endNode);
    openSet.add(startNode);

    while (openSet.size > 0) {
        // Find node with lowest f score
        let currentNode = Array.from(openSet).reduce((min, node) => 
            node.f < min.f ? node : min
        );

        if (currentNode === endNode) {
            return visitedNodesInOrder;
        }

        openSet.delete(currentNode);
        closedSet.add(`${currentNode.row}-${currentNode.col}`);
        visitedNodesInOrder.push(currentNode);

        const neighbors = getUnvisitedNeighbors(currentNode, grid, closedSet);
        for (const neighbor of neighbors) {
            if (!openSet.has(neighbor)) {
                neighbor.previousNode = currentNode;
                neighbor.f = getHeuristic(neighbor, endNode);
                openSet.add(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
};

const getUnvisitedNeighbors = (node: Node, grid: Node[][], closedSet: Set<string>): Node[] => {
    const neighbors: Node[] = [];
    const { row, col } = node;
    const directions = [
        [-1, 0], // up
        [0, 1],  // right
        [1, 0],  // down
        [0, -1], // left
    ];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
            newRow >= 0 &&
            newRow < grid.length &&
            newCol >= 0 &&
            newCol < grid[0].length &&
            !closedSet.has(`${newRow}-${newCol}`) &&
            grid[newRow][newCol].type !== 'wall'
        ) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
}; 