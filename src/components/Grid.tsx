"use client"

import type React from "react"
import { useState } from "react"
import { useVisualizerStore } from "../store/useVisualizerStore"
import { useVisualizer } from "../hooks/useVisualizer"
import Node from "./Node"
import { motion } from "framer-motion"
import { Minus, Plus, Layers } from "lucide-react"
import type { Node as NodeType, Grid } from "../types"

const Grid: React.FC = () => {
    const { grid, setGrid, startNode, endNode, setStartNode, setEndNode } = useVisualizerStore()
    const [isMousePressed, setIsMousePressed] = useState(false)
    const [nodeType, setNodeType] = useState<"wall" | "weight">("wall")
    const [weightValue, setWeightValue] = useState(5)

    useVisualizer()

    const handleMouseDown = (row: number, col: number) => {
        setIsMousePressed(true)
        const node = grid[row][col]

        if (node.type === "empty") {
            if (!startNode) {
                const newGrid = [...grid]
                newGrid[row][col] = { ...node, type: "start" }
                setGrid(newGrid)
                setStartNode(newGrid[row][col])
            } else if (!endNode) {
                const newGrid = [...grid]
                newGrid[row][col] = { ...node, type: "end" }
                setGrid(newGrid)
                setEndNode(newGrid[row][col])
            } else {
                const newGrid = [...grid]
                if (nodeType === "weight") {
                    newGrid[row][col] = { ...node, type: "weight", weight: weightValue }
                } else {
                    newGrid[row][col] = { ...node, type: nodeType }
                }
                setGrid(newGrid)
            }
        }
    }

    const handleMouseEnter = (row: number, col: number) => {
        if (!isMousePressed) return
        const node = grid[row][col]

        if (node.type === "empty") {
            const newGrid = [...grid]
            if (nodeType === "weight") {
                newGrid[row][col] = { ...node, type: "weight", weight: weightValue }
            } else {
                newGrid[row][col] = { ...node, type: nodeType }
            }
            setGrid(newGrid)
        }
    }

    const handleMouseUp = () => {
        setIsMousePressed(false)
    }

    const incrementWeight = () => {
        if (weightValue < 10) setWeightValue(weightValue + 1)
    }

    const decrementWeight = () => {
        if (weightValue > 1) setWeightValue(weightValue - 1)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
        >
            <div className="flex flex-wrap gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${nodeType === "wall"
                        ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                    onClick={() => setNodeType("wall")}
                >
                    <div className="w-3 h-3 rounded-sm bg-zinc-800 dark:bg-zinc-950"></div>
                    Wall
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${nodeType === "weight"
                        ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                    onClick={() => setNodeType("weight")}
                >
                    <Layers size={16} />
                    Weight
                </button>

                {nodeType === "weight" && (
                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                        <button
                            onClick={decrementWeight}
                            className="px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            disabled={weightValue <= 1}
                        >
                            <Minus size={16} className={weightValue <= 1 ? "opacity-50" : ""} />
                        </button>
                        <div className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">{weightValue}</div>
                        <button
                            onClick={incrementWeight}
                            className="px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            disabled={weightValue >= 10}
                        >
                            <Plus size={16} className={weightValue >= 10 ? "opacity-50" : ""} />
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                {!startNode
                    ? "Click to place start node"
                    : !endNode
                        ? "Click to place end node"
                        : `You're placing: ${nodeType === "wall" ? "Walls" : "Weights"}`}
            </div>

            <div className="grid gap-[1px] bg-zinc-200 dark:bg-zinc-700 p-1 rounded-lg" onMouseLeave={handleMouseUp}>
                {grid.map((row: NodeType[], rowIndex: number) => (
                    <div key={rowIndex} className="flex">
                        {row.map((node: NodeType, colIndex: number) => (
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
        </motion.div>
    )
}

export default Grid
