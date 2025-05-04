"use client"

import type React from "react"
import { useVisualizerStore } from "../store/useVisualizerStore"
import type { Algorithm } from "../types"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Shuffle } from "lucide-react"

const Controls: React.FC = () => {
    const {
        currentAlgorithm,
        setCurrentAlgorithm,
        isRunning,
        setIsRunning,
        isPaused,
        setIsPaused,
        speed,
        setSpeed,
        resetGrid,
        generateRandomMap,
    } = useVisualizerStore()

    const algorithms: Algorithm[] = [
        "BFS",
        "DFS",
        "Dijkstra",
        "A*",
        "Greedy",
        "BellmanFord",
        "FloydWarshall",
        "Bidirectional",
        "JumpPoint",
    ]

    const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentAlgorithm(e.target.value as Algorithm)
    }

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeed(Number(e.target.value))
    }

    const handleStart = () => {
        setIsRunning(true)
        setIsPaused(false)
    }

    const handlePause = () => {
        setIsPaused(!isPaused)
    }

    const handleReset = () => {
        resetGrid()
        setIsRunning(false)
        setIsPaused(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
        >
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-6">Algorithm Controls</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="algorithm" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Algorithm
                            </label>
                            <select
                                id="algorithm"
                                value={currentAlgorithm}
                                onChange={handleAlgorithmChange}
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400 disabled:opacity-50"
                                disabled={isRunning}
                            >
                                {algorithms.map((algorithm) => (
                                    <option key={algorithm} value={algorithm}>
                                        {algorithm}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="speed" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Visualization Speed
                            </label>
                            <input
                                id="speed"
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={handleSpeedChange}
                                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                            />
                            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                <span>Slower</span>
                                <span>Faster</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleStart}
                            disabled={isRunning}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isRunning
                                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:opacity-90 shadow-md shadow-fuchsia-500/10 dark:shadow-fuchsia-900/20"
                                }`}
                        >
                            <Play size={16} />
                            Start
                        </button>
                        <button
                            onClick={handlePause}
                            disabled={!isRunning}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${!isRunning
                                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-md shadow-amber-500/10 dark:shadow-amber-900/20"
                                }`}
                        >
                            <Pause size={16} />
                            {isPaused ? "Resume" : "Pause"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                        <button
                            onClick={generateRandomMap}
                            disabled={isRunning}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isRunning
                                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 shadow-md shadow-violet-500/10 dark:shadow-violet-900/20"
                                }`}
                        >
                            <Shuffle size={16} />
                            Random Map
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Controls
