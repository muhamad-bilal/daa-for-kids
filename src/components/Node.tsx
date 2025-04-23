import React from 'react';
import { Node as NodeType } from '../types';

interface NodeProps {
    node: NodeType;
    onMouseDown: (row: number, col: number) => void;
    onMouseEnter: (row: number, col: number) => void;
    onMouseUp: () => void;
}

const Node: React.FC<NodeProps> = ({ node, onMouseDown, onMouseEnter, onMouseUp }) => {
    const { row, col, type, isVisited, isPath, weight } = node;

    const getNodeClassName = () => {
        let className = 'w-6 h-6 border border-gray-300 flex items-center justify-center';

        if (type === 'start') {
            className += ' bg-green-500';
        } else if (type === 'end') {
            className += ' bg-red-500';
        } else if (type === 'wall') {
            className += ' bg-gray-800';
        } else if (isPath) {
            className += ' bg-yellow-500';
        } else if (isVisited) {
            className += ' bg-blue-500';
        } else if (type === 'weight') {
            className += ' bg-purple-200';
        } else {
            className += ' bg-white';
        }

        return className;
    };

    return (
        <div
            className={getNodeClassName()}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
        >
            {type === 'weight' && <span className="text-xs font-medium">{weight}</span>}
        </div>
    );
};

export default Node; 