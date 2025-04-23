import { Node } from '../types';

export const dfs = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const stack: Node[] = [];
    const visited = new Set<string>();

    stack.push(startNode);
    visited.add(`${startNode.row}-${startNode.col}`);

    while (stack.length > 0) {
        const currentNode = stack.pop()!;
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) {
            return visitedNodesInOrder;
        }

        const neighbors = getUnvisitedNeighbors(currentNode, grid, visited);
        for (const neighbor of neighbors) {
            visited.add(`${neighbor.row}-${neighbor.col}`);
            neighbor.previousNode = currentNode;
            stack.push(neighbor);
        }
    }

    return visitedNodesInOrder;
};

const getUnvisitedNeighbors = (node: Node, grid: Node[][], visited: Set<string>): Node[] => {
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
            !visited.has(`${newRow}-${newCol}`) &&
            grid[newRow][newCol].type !== 'wall'
        ) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
}; 