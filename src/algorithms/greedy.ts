import { Node, Grid } from '../types';

export const greedy = (grid: Grid, startNode: Node, endNode: Node) => {
    const visitedNodesInOrder: Node[] = [];
    const openSet: Node[] = [];
    const closedSet = new Set<string>();

    // Get the actual nodes from the grid
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    // Initialize start node
    start.distance = 0;
    start.fScore = heuristic(start, end);
    openSet.push(start);

    while (openSet.length > 0) {
        sortNodesByFScore(openSet);
        const currentNode = openSet.shift()!;

        if (currentNode.row === end.row && currentNode.col === end.col) {
            return visitedNodesInOrder;
        }

        closedSet.add(`${currentNode.row}-${currentNode.col}`);
        visitedNodesInOrder.push(currentNode);

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.type === 'wall' || closedSet.has(`${neighbor.row}-${neighbor.col}`)) {
                continue;
            }

            if (!openSet.includes(neighbor)) {
                neighbor.previousNode = currentNode;
                neighbor.fScore = heuristic(neighbor, end);
                openSet.push(neighbor);
            }
        }
    }

    return visitedNodesInOrder;
};

const heuristic = (node: Node, endNode: Node): number => {
    const dx = Math.abs(node.row - endNode.row);
    const dy = Math.abs(node.col - endNode.col);
    return dx + dy;
};

const sortNodesByFScore = (nodes: Node[]) => {
    nodes.sort((a, b) => a.fScore - b.fScore);
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