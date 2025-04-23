import { Node } from '../types';

export const floydWarshall = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const rows = grid.length;
    const cols = grid[0].length;
    const size = rows * cols;
    
    // Initialize distance and next matrices
    const dist: number[][] = Array(size).fill(null).map(() => Array(size).fill(Infinity));
    const next: (number | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null));

    // Convert 2D grid coordinates to 1D indices
    const toIndex = (row: number, col: number) => row * cols + col;
    const toCoords = (index: number) => ({ row: Math.floor(index / cols), col: index % cols });

    // Initialize distances and next pointers
    for (let i = 0; i < size; i++) {
        const { row: iRow, col: iCol } = toCoords(i);
        if (grid[iRow][iCol].type === 'wall') continue;

        dist[i][i] = 0;
        next[i][i] = i;

        const neighbors = getNeighbors(grid, iRow, iCol);
        for (const neighbor of neighbors) {
            const j = toIndex(neighbor.row, neighbor.col);
            dist[i][j] = neighbor.weight;
            next[i][j] = j;
        }
    }

    // Floyd-Warshall algorithm
    for (let k = 0; k < size; k++) {
        const { row: kRow, col: kCol } = toCoords(k);
        if (grid[kRow][kCol].type === 'wall') continue;

        for (let i = 0; i < size; i++) {
            const { row: iRow, col: iCol } = toCoords(i);
            if (grid[iRow][iCol].type === 'wall') continue;

            for (let j = 0; j < size; j++) {
                const { row: jRow, col: jCol } = toCoords(j);
                if (grid[jRow][jCol].type === 'wall') continue;

                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    // Reconstruct path
    const startIndex = toIndex(startNode.row, startNode.col);
    const endIndex = toIndex(endNode.row, endNode.col);
    
    if (next[startIndex][endIndex] === null) {
        return visitedNodesInOrder;
    }

    let current = startIndex;
    while (current !== endIndex) {
        const { row, col } = toCoords(current);
        visitedNodesInOrder.push(grid[row][col]);
        
        const nextIndex = next[current][endIndex];
        if (nextIndex === null) break;
        
        const { row: nextRow, col: nextCol } = toCoords(nextIndex);
        grid[nextRow][nextCol].previousNode = grid[row][col];
        current = nextIndex;
    }

    visitedNodesInOrder.push(endNode);
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