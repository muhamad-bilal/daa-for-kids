"use client"

import type React from "react"
import type { Node as NodeType } from "../types"

interface NodeProps {
    node: NodeType
    onMouseDown: (row: number, col: number) => void
    onMouseEnter: (row: number, col: number) => void
    onMouseUp: () => void
}

const Node: React.FC<NodeProps> = ({ node, onMouseDown, onMouseEnter, onMouseUp }) => {
    const { row, col, type, isVisited, isPath, weight } = node

    const getNodeClassName = () => {
        let className = "w-6 h-6 flex items-center justify-center transition-all duration-200 border border-zinc-200 dark:border-zinc-700"

        if (type === "start") {
            className += " bg-fuchsia-500"
        } else if (type === "end") {
            className += " bg-violet-500"
        } else if (type === "wall") {
            className += " bg-zinc-800 dark:bg-zinc-950"
        } else if (isPath) {
            className += " bg-violet-300 dark:bg-violet-700"
        } else if (isVisited) {
            className += " bg-fuchsia-200 dark:bg-fuchsia-900"
        } else if (type === "weight") {
            className += " bg-blue-300 dark:bg-blue-700"
        } else {
            className += " bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        }

        return className
    }

    return (
        <div
            id={`node-${row}-${col}`}
            className={getNodeClassName()}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={onMouseUp}
        >
            {type === "weight" && <span className="text-xs font-bold text-blue-900 dark:text-blue-100">{weight}</span>}
        </div>
    )
}

export default Node
