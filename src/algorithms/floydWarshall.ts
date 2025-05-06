import { Node, Grid } from '../types';

export const floydWarshall = (grid: Grid, startNode: Node, endNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    const nodes = getAllNodes(grid);
    const n = nodes.length;
    
    // Initialize distance and next matrices
    const dist: number[][] = Array(n).fill(0).map(() => Array(n).fill(Number.POSITIVE_INFINITY));
    const next: (number | null)[][] = Array(n).fill(0).map(() => Array(n).fill(null));

    // Get the actual nodes from the grid
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    // Initialize distances and next pointers
    for (let i = 0; i < n; i++) {
        const node = nodes[i];
        dist[i][i] = 0;
        
        const neighbors = getNeighbors(node, grid);
        for (const neighbor of neighbors) {
            const j = nodes.indexOf(neighbor);
            if (j !== -1) {
                dist[i][j] = neighbor.weight;
                next[i][j] = j;
            }
        }
    }

    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] !== Number.POSITIVE_INFINITY && 
                    dist[k][j] !== Number.POSITIVE_INFINITY && 
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    // Reconstruct path
    const startIndex = nodes.indexOf(start);
    const endIndex = nodes.indexOf(end);
    
    if (startIndex === -1 || endIndex === -1 || 
        dist[startIndex][endIndex] === Number.POSITIVE_INFINITY) {
        return visitedNodesInOrder;
    }

    let current = startIndex;
    while (current !== endIndex) {
        visitedNodesInOrder.push(nodes[current]);
        const nextNode = next[current][endIndex];
        if (nextNode === null) break;
        current = nextNode;
    }
    visitedNodesInOrder.push(nodes[endIndex]);

    return visitedNodesInOrder;
};

const getAllNodes = (grid: Grid): Node[] => {
    const nodes: Node[] = [];
    for (const row of grid) {
        for (const node of row) {
            if (node.type !== 'wall') {
                nodes.push(node);
            }
        }
    }
    return nodes;
};

const getNeighbors = (node: Node, grid: Grid): Node[] => {
    const neighbors: Node[] = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => neighbor.type !== 'wall');
}; 