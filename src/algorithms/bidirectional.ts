import { Node, Grid } from '../types';

export const bidirectional = (grid: Grid, startNode: Node, endNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    const forwardQueue: Node[] = [];
    const backwardQueue: Node[] = [];
    const forwardVisited = new Set<string>();
    const backwardVisited = new Set<string>();
    const forwardParent = new Map<string, Node>();
    const backwardParent = new Map<string, Node>();

    // Get the actual nodes from the grid
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    // Initialize start and end nodes
    start.distance = 0;
    end.distance = 0;
    forwardQueue.push(start);
    backwardQueue.push(end);
    forwardVisited.add(`${start.row}-${start.col}`);
    backwardVisited.add(`${end.row}-${end.col}`);
    visitedNodesInOrder.push(start);
    visitedNodesInOrder.push(end);

    while (forwardQueue.length > 0 && backwardQueue.length > 0) {
        // Forward BFS
        const forwardNode = forwardQueue.shift()!;
        const forwardKey = `${forwardNode.row}-${forwardNode.col}`;

        if (backwardVisited.has(forwardKey)) {
            // Path found
            const intersection = forwardNode;
            const path = reconstructPath(
                intersection,
                forwardParent,
                backwardParent,
                start,
                end
            );
            visitedNodesInOrder.push(...path);
            return visitedNodesInOrder;
        }

        const forwardNeighbors = getNeighbors(forwardNode, grid);
        for (const neighbor of forwardNeighbors) {
            const key = `${neighbor.row}-${neighbor.col}`;
            if (!forwardVisited.has(key) && neighbor.type !== 'wall') {
                forwardVisited.add(key);
                forwardParent.set(key, forwardNode);
                forwardQueue.push(neighbor);
                visitedNodesInOrder.push(neighbor);
            }
        }

        // Backward BFS
        const backwardNode = backwardQueue.shift()!;
        const backwardKey = `${backwardNode.row}-${backwardNode.col}`;

        if (forwardVisited.has(backwardKey)) {
            // Path found
            const intersection = backwardNode;
            const path = reconstructPath(
                intersection,
                forwardParent,
                backwardParent,
                start,
                end
            );
            visitedNodesInOrder.push(...path);
            return visitedNodesInOrder;
        }

        const backwardNeighbors = getNeighbors(backwardNode, grid);
        for (const neighbor of backwardNeighbors) {
            const key = `${neighbor.row}-${neighbor.col}`;
            if (!backwardVisited.has(key) && neighbor.type !== 'wall') {
                backwardVisited.add(key);
                backwardParent.set(key, backwardNode);
                backwardQueue.push(neighbor);
                visitedNodesInOrder.push(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
};

const reconstructPath = (
    intersection: Node,
    forwardParent: Map<string, Node>,
    backwardParent: Map<string, Node>,
    start: Node,
    end: Node
): Node[] => {
    const path: Node[] = [];
    let current: Node | null = intersection;

    // Reconstruct forward path
    while (current !== start) {
        const key = `${current.row}-${current.col}`;
        const parent = forwardParent.get(key);
        if (!parent) break;
        current.previousNode = parent;
        current = parent;
    }

    // Reconstruct backward path
    current = intersection;
    while (current !== end) {
        const key = `${current.row}-${current.col}`;
        const parent = backwardParent.get(key);
        if (!parent) break;
        parent.previousNode = current;
        current = parent;
    }

    return path;
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