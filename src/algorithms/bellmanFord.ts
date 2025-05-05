import { Node } from '../types';

export const bellmanFord = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const visited = new Set<string>();
    
    // Reset nodes
    grid.forEach(row => {
        row.forEach(node => {
            node.distance = Infinity;
            node.previousNode = null;
            node.isVisited = false;
            node.isPath = false;
        });
    });
    
    // Initialize start node
    startNode.distance = 0;
    startNode.isVisited = true;
    visitedNodesInOrder.push(startNode);
    visited.add(`${startNode.row}-${startNode.col}`);
    
    // Get all valid nodes (non-walls)
    const allNodes: Node[] = [];
    grid.forEach(row => {
        row.forEach(node => {
            if (node.type !== 'wall') {
                allNodes.push(node);
            }
        });
    });
    
    // Relax edges |V|-1 times
    const V = allNodes.length;
    for (let i = 0; i < V - 1; i++) {
        let updated = false;
        
        for (const node of allNodes) {
            if (node.distance === Infinity) continue;
            
            const neighbors = getNeighbors(grid, node.row, node.col);
            for (const neighbor of neighbors) {
                const newDist = node.distance + neighbor.weight;
                if (newDist < neighbor.distance) {
                    neighbor.distance = newDist;
                    neighbor.previousNode = node;
                    updated = true;
                    
                    const nodeKey = `${neighbor.row}-${neighbor.col}`;
                    if (!visited.has(nodeKey)) {
                        visited.add(nodeKey);
                        neighbor.isVisited = true;
                        visitedNodesInOrder.push(neighbor);
                    }
                }
            }
        }
        
        // If no updates were made in this pass, we can stop early
        if (!updated) break;
        
        // If we've reached the end node, we can stop early
        if (visited.has(`${endNode.row}-${endNode.col}`)) {
            break;
        }
    }
    
    // Check for negative cycles
    let hasNegativeCycle = false;
    for (const node of allNodes) {
        if (node.distance === Infinity) continue;
        
        const neighbors = getNeighbors(grid, node.row, node.col);
        for (const neighbor of neighbors) {
            const newDist = node.distance + neighbor.weight;
            if (newDist < neighbor.distance) {
                hasNegativeCycle = true;
                break;
            }
        }
        
        if (hasNegativeCycle) break;
    }
    
    // In case of negative cycle, we might want to handle it differently
    // For visualization purposes, we just return what we have so far
    if (hasNegativeCycle) {
        console.warn("Negative cycle detected in the graph");
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

export const getNodesInShortestPathOrder = (endNode: Node): Node[] => {
    const nodesInShortestPathOrder: Node[] = [];
    let currentNode: Node | null = endNode;
  
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
  
    return nodesInShortestPathOrder;
};