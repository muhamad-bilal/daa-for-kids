import { Node, Grid } from '../types';

export const jumpPoint = (grid: Grid, startNode: Node, endNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    const openSet = new Set<Node>();
    const closedSet = new Set<Node>();

    // Get the actual nodes from the grid
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    // Initialize start node
    start.distance = 0;
    start.fScore = heuristic(start, end);
    openSet.add(start);

    while (openSet.size > 0) {
        // Get node with lowest fScore
        let current = getLowestFScore(openSet);
        if (current === end) {
            return visitedNodesInOrder;
        }

        openSet.delete(current);
        closedSet.add(current);
        visitedNodesInOrder.push(current);

        // Get jump points in all directions
        const neighbors = getNeighbors(current, grid);
        for (const neighbor of neighbors) {
            if (closedSet.has(neighbor)) continue;

            const jumpPoint = jump(neighbor, current, end, grid);
            if (jumpPoint) {
                const tentativeGScore = current.distance + heuristic(current, jumpPoint);
                if (!openSet.has(jumpPoint) || tentativeGScore < jumpPoint.distance) {
                    jumpPoint.previousNode = current;
                    jumpPoint.distance = tentativeGScore;
                    jumpPoint.fScore = tentativeGScore + heuristic(jumpPoint, end);
                    if (!openSet.has(jumpPoint)) {
                        openSet.add(jumpPoint);
                    }
                }
            }
        }
    }

    return visitedNodesInOrder;
};

const jump = (node: Node, parent: Node, end: Node, grid: Grid): Node | null => {
    const dx = node.row - parent.row;
    const dy = node.col - parent.col;

    if (!isWalkable(node, grid)) return null;
    if (node === end) return node;

    // Check for forced neighbors
    if (dx !== 0 && dy !== 0) {
        // Diagonal movement
        if (
            (isWalkable(grid[node.row][node.col + dy], grid) && !isWalkable(grid[node.row + dx][node.col + dy], grid)) ||
            (isWalkable(grid[node.row + dx][node.col], grid) && !isWalkable(grid[node.row + dx][node.col + dy], grid))
        ) {
            return node;
        }
    } else {
        // Straight movement
        if (dx !== 0) {
            // Horizontal movement
            if (
                (isWalkable(grid[node.row][node.col + 1], grid) && !isWalkable(grid[node.row + dx][node.col + 1], grid)) ||
                (isWalkable(grid[node.row][node.col - 1], grid) && !isWalkable(grid[node.row + dx][node.col - 1], grid))
            ) {
                return node;
            }
        } else {
            // Vertical movement
            if (
                (isWalkable(grid[node.row + 1][node.col], grid) && !isWalkable(grid[node.row + 1][node.col + dy], grid)) ||
                (isWalkable(grid[node.row - 1][node.col], grid) && !isWalkable(grid[node.row - 1][node.col + dy], grid))
            ) {
                return node;
            }
        }
    }

    // Recursively check next node
    if (dx !== 0 && dy !== 0) {
        // Diagonal movement
        if (jump(grid[node.row + dx][node.col], node, end, grid)) return node;
        if (jump(grid[node.row][node.col + dy], node, end, grid)) return node;
    }

    return jump(grid[node.row + dx][node.col + dy], node, end, grid);
};

const isWalkable = (node: Node, grid: Grid): boolean => {
    return (
        node.row >= 0 &&
        node.row < grid.length &&
        node.col >= 0 &&
        node.col < grid[0].length &&
        node.type !== 'wall'
    );
};

const getNeighbors = (node: Node, grid: Grid): Node[] => {
    const neighbors: Node[] = [];
    const { row, col } = node;

    // Add all 8 directions
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
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
    }

    return neighbors;
};

const getLowestFScore = (openSet: Set<Node>): Node => {
    let lowest: Node | null = null;
    let lowestFScore = Infinity;

    for (const node of Array.from(openSet)) {
        if (node.fScore < lowestFScore) {
            lowestFScore = node.fScore;
            lowest = node;
        }
    }

    return lowest!;
};

const heuristic = (nodeA: Node, nodeB: Node): number => {
    const dx = Math.abs(nodeA.row - nodeB.row);
    const dy = Math.abs(nodeA.col - nodeB.col);
    return Math.sqrt(dx * dx + dy * dy);
}; 