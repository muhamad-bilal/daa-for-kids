import { Node } from '../types';

export const bellmanFord = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const distances: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(Infinity));
    const predecessors: (Node | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));

    // Initialize distances
    distances[startNode.row][startNode.col] = 0;
    visitedNodesInOrder.push(startNode);

    // Relax edges V-1 times
    for (let i = 0; i < rows * cols - 1; i++) {
        let updated = false;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col].type === 'wall') continue;

                const neighbors = getNeighbors(grid, row, col);
                for (const neighbor of neighbors) {
                    const newDist = distances[row][col] + neighbor.weight;
                    if (newDist < distances[neighbor.row][neighbor.col]) {
                        distances[neighbor.row][neighbor.col] = newDist;
                        predecessors[neighbor.row][neighbor.col] = grid[row][col];
                        updated = true;
                        if (!visitedNodesInOrder.includes(neighbor)) {
                            visitedNodesInOrder.push(neighbor);
                        }
                    }
                }
            }
        }
        if (!updated) break;
    }

    // Check for negative cycles
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col].type === 'wall') continue;

            const neighbors = getNeighbors(grid, row, col);
            for (const neighbor of neighbors) {
                if (distances[row][col] + neighbor.weight < distances[neighbor.row][neighbor.col]) {
                    // Negative cycle detected
                    return visitedNodesInOrder;
                }
            }
        }
    }

    // Set previous nodes for path reconstruction
    if (predecessors[endNode.row][endNode.col]) {
        let current = endNode;
        while (current !== startNode && current) {
            const prev = predecessors[current.row][current.col];
            if (prev) {
                prev.previousNode = current;
                current = prev;
            } else {
                break;
            }
        }
    }

    return visitedNodesInOrder;
};

const getNeighbors = (grid: Node[][], row: number, col: number): Node[] => {
    const neighbors: Node[] = [];
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
            grid[newRow][newCol].type !== 'wall'
        ) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
}; 