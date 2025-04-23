import { Node } from '../types';

export const jumpPoint = (grid: Node[][], startNode: Node, endNode: Node): Node[] => {
    const visitedNodesInOrder: Node[] = [];
    const openSet = new Set<Node>();
    const closedSet = new Set<string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const cameFrom = new Map<string, Node>();

    // Initialize scores
    const startKey = `${startNode.row}-${startNode.col}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, getHeuristic(startNode, endNode));
    openSet.add(startNode);

    while (openSet.size > 0) {
        // Get node with lowest fScore
        let current = Array.from(openSet).reduce((min, node) => {
            const key = `${node.row}-${node.col}`;
            const minKey = `${min.row}-${min.col}`;
            return (fScore.get(key) || Infinity) < (fScore.get(minKey) || Infinity) ? node : min;
        });

        if (current === endNode) {
            return reconstructPath(cameFrom, current, visitedNodesInOrder);
        }

        openSet.delete(current);
        closedSet.add(`${current.row}-${current.col}`);
        visitedNodesInOrder.push(current);

        const jumpPoints = findJumpPoints(current, grid, endNode);
        for (const jumpPoint of jumpPoints) {
            const jumpKey = `${jumpPoint.row}-${jumpPoint.col}`;
            if (closedSet.has(jumpKey)) continue;

            const tentativeGScore = (gScore.get(`${current.row}-${current.col}`) || 0) +
                getDistance(current, jumpPoint);

            if (!openSet.has(jumpPoint)) {
                openSet.add(jumpPoint);
            } else if (tentativeGScore >= (gScore.get(jumpKey) || Infinity)) {
                continue;
            }

            cameFrom.set(jumpKey, current);
            gScore.set(jumpKey, tentativeGScore);
            fScore.set(jumpKey, tentativeGScore + getHeuristic(jumpPoint, endNode));
        }
    }

    return visitedNodesInOrder;
};

const findJumpPoints = (node: Node, grid: Node[][], endNode: Node): Node[] => {
    const jumpPoints: Node[] = [];
    const directions = [
        [-1, 0], // up
        [0, 1],  // right
        [1, 0],  // down
        [0, -1], // left
    ];

    for (const [dr, dc] of directions) {
        let current = node;
        let nextRow = current.row + dr;
        let nextCol = current.col + dc;

        while (
            nextRow >= 0 &&
            nextRow < grid.length &&
            nextCol >= 0 &&
            nextCol < grid[0].length &&
            grid[nextRow][nextCol].type !== 'wall'
        ) {
            const nextNode = grid[nextRow][nextCol];
            
            // Check if this is a jump point
            if (isJumpPoint(nextNode, grid, dr, dc)) {
                jumpPoints.push(nextNode);
                break;
            }

            // Check if we've reached the end node
            if (nextNode === endNode) {
                jumpPoints.push(nextNode);
                break;
            }

            current = nextNode;
            nextRow += dr;
            nextCol += dc;
        }
    }

    return jumpPoints;
};

const isJumpPoint = (node: Node, grid: Node[][], dr: number, dc: number): boolean => {
    const { row, col } = node;

    // Check for forced neighbors
    if (dr !== 0) {
        // Moving vertically
        if (
            (col > 0 && grid[row][col - 1].type === 'wall' && grid[row + dr][col - 1].type !== 'wall') ||
            (col < grid[0].length - 1 && grid[row][col + 1].type === 'wall' && grid[row + dr][col + 1].type !== 'wall')
        ) {
            return true;
        }
    } else {
        // Moving horizontally
        if (
            (row > 0 && grid[row - 1][col].type === 'wall' && grid[row - 1][col + dc].type !== 'wall') ||
            (row < grid.length - 1 && grid[row + 1][col].type === 'wall' && grid[row + 1][col + dc].type !== 'wall')
        ) {
            return true;
        }
    }

    return false;
};

const getHeuristic = (node: Node, endNode: Node): number => {
    // Manhattan distance
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
};

const getDistance = (node1: Node, node2: Node): number => {
    return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
};

const reconstructPath = (
    cameFrom: Map<string, Node>,
    current: Node,
    visitedNodesInOrder: Node[]
): Node[] => {
    const path: Node[] = [current];
    let currentKey = `${current.row}-${current.col}`;

    while (cameFrom.has(currentKey)) {
        current = cameFrom.get(currentKey)!;
        path.unshift(current);
        currentKey = `${current.row}-${current.col}`;
    }

    // Set previous nodes for visualization
    for (let i = 1; i < path.length; i++) {
        path[i].previousNode = path[i - 1];
    }

    return [...visitedNodesInOrder, ...path];
}; 