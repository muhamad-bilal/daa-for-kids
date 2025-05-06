import { Node, Grid } from '../types';

export const bellmanFord = (grid: Grid, startNode: Node, endNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    const nodes = getAllNodes(grid);
    
    // Get the actual nodes from the grid
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];
    
    // Initialize start node
    start.distance = 0;
    visitedNodesInOrder.push(start);
    
    // Run V-1 iterations
    for (let i = 0; i < nodes.length - 1; i++) {
        let updated = false;
        
        for (const node of nodes) {
            if (node.distance === Number.POSITIVE_INFINITY) continue;
            
            const neighbors = getNeighbors(node, grid);
            for (const neighbor of neighbors) {
                if (neighbor.type === 'wall') continue;
                
                const newDistance = node.distance + neighbor.weight;
                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previousNode = node;
                    updated = true;
                    if (!visitedNodesInOrder.includes(neighbor)) {
                        visitedNodesInOrder.push(neighbor);
                    }
                }
            }
        }
        
        if (!updated) break;
    }
    
    // Check for negative cycles
    for (const node of nodes) {
        if (node.distance === Number.POSITIVE_INFINITY) continue;
        
        const neighbors = getNeighbors(node, grid);
        for (const neighbor of neighbors) {
            if (neighbor.type === 'wall') continue;
            
            if (node.distance + neighbor.weight < neighbor.distance) {
                // Negative cycle detected
                return visitedNodesInOrder;
            }
        }
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