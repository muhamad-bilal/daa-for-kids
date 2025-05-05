import { useState, useCallback } from 'react';
import { Node, Grid } from '../types/pathfinding';

export const useVisualizer = () => {
    const [grid, setGrid] = useState<Grid>([]);
    const [startNode, setStartNode] = useState<Node | null>(null);
    const [endNode, setEndNode] = useState<Node | null>(null);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [visualizationSpeed, setVisualizationSpeed] = useState(50);

    const initializeGrid = useCallback((rows: number, cols: number) => {
        const newGrid: Grid = [];
        for (let row = 0; row < rows; row++) {
            const currentRow: Node[] = [];
            for (let col = 0; col < cols; col++) {
                currentRow.push({
                    row,
                    col,
                    isStart: false,
                    isEnd: false,
                    isWall: false,
                    isVisited: false,
                    isPath: false,
                    distance: Infinity,
                    previousNode: null,
                });
            }
            newGrid.push(currentRow);
        }
        setGrid(newGrid);
    }, []);

    const setNodeAsStart = useCallback((row: number, col: number) => {
        if (startNode) {
            grid[startNode.row][startNode.col].isStart = false;
        }
        const node = grid[row][col];
        node.isStart = true;
        setStartNode(node);
        setGrid([...grid]);
    }, [grid, startNode]);

    const setNodeAsEnd = useCallback((row: number, col: number) => {
        if (endNode) {
            grid[endNode.row][endNode.col].isEnd = false;
        }
        const node = grid[row][col];
        node.isEnd = true;
        setEndNode(node);
        setGrid([...grid]);
    }, [grid, endNode]);

    const toggleWall = useCallback((row: number, col: number) => {
        const node = grid[row][col];
        if (!node.isStart && !node.isEnd) {
            node.isWall = !node.isWall;
            setGrid([...grid]);
        }
    }, [grid]);

    const clearGrid = useCallback(() => {
        const newGrid = grid.map(row =>
            row.map(node => ({
                ...node,
                isVisited: false,
                isPath: false,
                distance: Infinity,
                previousNode: null,
            }))
        );
        setGrid(newGrid);
    }, [grid]);

    const resetGrid = useCallback(() => {
        const newGrid = grid.map(row =>
            row.map(node => ({
                ...node,
                isWall: false,
                isVisited: false,
                isPath: false,
                distance: Infinity,
                previousNode: null,
            }))
        );
        setGrid(newGrid);
    }, [grid]);

    return {
        grid,
        startNode,
        endNode,
        isVisualizing,
        visualizationSpeed,
        setGrid,
        setStartNode,
        setEndNode,
        setIsVisualizing,
        setVisualizationSpeed,
        initializeGrid,
        setNodeAsStart,
        setNodeAsEnd,
        toggleWall,
        clearGrid,
        resetGrid,
    };
}; 