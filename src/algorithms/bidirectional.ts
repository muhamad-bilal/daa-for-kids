import { Node } from '../types';

export const bidirectional = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const startQueue: Node[] = [startNode];
    const endQueue: Node[] = [endNode];
    const startVisited = new Set<string>();
    const endVisited = new Set<string>();
    const startParent = new Map<string, Node>();
    const endParent = new Map<string, Node>();

    startVisited.add(`${startNode.row}-${startNode.col}`);
    endVisited.add(`${endNode.row}-${endNode.col}`);

    while (startQueue.length > 0 && endQueue.length > 0) {
        // Search from start
        const startCurrent = startQueue.shift()!;
        visitedNodesInOrder.push(startCurrent);

        if (endVisited.has(`${startCurrent.row}-${startCurrent.col}`)) {
            // Path found
            const intersection = startCurrent;
            const path = reconstructPath(intersection, startParent, endParent);
            return [...visitedNodesInOrder, ...path];
        }

        const startNeighbors = getNeighbors(grid, startCurrent);
        for (const neighbor of startNeighbors) {
            const key = `${neighbor.row}-${neighbor.col}`;
            if (!startVisited.has(key)) {
                startVisited.add(key);
                startParent.set(key, startCurrent);
                startQueue.push(neighbor);
            }
        }

        // Search from end
        const endCurrent = endQueue.shift()!;
        visitedNodesInOrder.push(endCurrent);

        if (startVisited.has(`${endCurrent.row}-${endCurrent.col}`)) {
            // Path found
            const intersection = endCurrent;
            const path = reconstructPath(intersection, startParent, endParent);
            return [...visitedNodesInOrder, ...path];
        }

        const endNeighbors = getNeighbors(grid, endCurrent);
        for (const neighbor of endNeighbors) {
            const key = `${neighbor.row}-${neighbor.col}`;
            if (!endVisited.has(key)) {
                endVisited.add(key);
                endParent.set(key, endCurrent);
                endQueue.push(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
};

const reconstructPath = (
    intersection: Node,
    startParent: Map<string, Node>,
    endParent: Map<string, Node>
): Node[] => {
    const path: Node[] = [];
    let current: Node | undefined = intersection;

    // Reconstruct path from intersection to start
    while (current) {
        path.unshift(current);
        const key = `${current.row}-${current.col}`;
        current = startParent.get(key);
    }

    // Reconstruct path from intersection to end
    current = endParent.get(`${intersection.row}-${intersection.col}`);
    while (current) {
        path.push(current);
        const key = `${current.row}-${current.col}`;
        current = endParent.get(key);
    }

    // Set previous nodes for visualization
    for (let i = 1; i < path.length; i++) {
        path[i].previousNode = path[i - 1];
    }

    return path;
};

const getNeighbors = (grid: Node[][], node: Node): Node[] => {
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
            grid[newRow][newCol].type !== 'wall'
        ) {
            neighbors.push(grid[newRow][newCol]);
        }
    }

    return neighbors;
}; 