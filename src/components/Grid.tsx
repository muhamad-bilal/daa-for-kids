import React, { useState } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { useVisualizer } from '../hooks/useVisualizer';
import Node from './Node';
import { Node as NodeType } from '../types';

const Grid: React.FC = () => {
    const { grid, setGrid, startNode, endNode, setStartNode, setEndNode } = useVisualizerStore();
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [nodeType, setNodeType] = useState<'wall' | 'weight'>('wall');
    const [weightValue, setWeightValue] = useState(5);

    useVisualizer();

    const handleMouseDown = (row: number, col: number) => {
        setIsMousePressed(true);
        const node = grid[row][col];

        if (node.type === 'empty') {
            if (!startNode) {
                const newGrid = [...grid];
                newGrid[row][col] = { ...node, type: 'start' };
                setGrid(newGrid);
                setStartNode(newGrid[row][col]);
            } else if (!endNode) {
                const newGrid = [...grid];
                newGrid[row][col] = { ...node, type: 'end' };
                setGrid(newGrid);
                setEndNode(newGrid[row][col]);
            } else {
                const newGrid = [...grid];
                if (nodeType === 'weight') {
                    newGrid[row][col] = { ...node, type: 'weight', weight: weightValue };
                } else {
                    newGrid[row][col] = { ...node, type: nodeType };
                }
                setGrid(newGrid);
            }
        }
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!isMousePressed) return;
        const node = grid[row][col];

        if (node.type === 'empty') {
            const newGrid = [...grid];
            if (nodeType === 'weight') {
                newGrid[row][col] = { ...node, type: 'weight', weight: weightValue };
            } else {
                newGrid[row][col] = { ...node, type: nodeType };
            }
            setGrid(newGrid);
        }
    };

    const handleMouseUp = () => {
        setIsMousePressed(false);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${nodeType === 'wall' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                    onClick={() => setNodeType('wall')}
                >
                    Wall
                </button>
                <button
                    className={`px-4 py-2 rounded ${nodeType === 'weight' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setNodeType('weight')}
                >
                    Weight
                </button>
                {nodeType === 'weight' && (
                    <div className="flex items-center space-x-2">
                        <label htmlFor="weight" className="text-sm">Weight Value:</label>
                        <input
                            id="weight"
                            type="number"
                            min="1"
                            max="10"
                            value={weightValue}
                            onChange={(e) => setWeightValue(Number(e.target.value))}
                            className="w-16 px-2 py-1 border rounded"
                        />
                    </div>
                )}
            </div>
            <div className="grid gap-0">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {row.map((node, colIndex) => (
                            <Node
                                key={`${rowIndex}-${colIndex}`}
                                node={node}
                                onMouseDown={handleMouseDown}
                                onMouseEnter={handleMouseEnter}
                                onMouseUp={handleMouseUp}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid; 