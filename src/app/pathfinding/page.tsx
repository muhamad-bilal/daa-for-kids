"use client"
import Grid from "../../components/Grid"
import Controls from "../../components/Controls"
import AlgorithmInfo from "../../components/AlgorithmInfo"
import ErrorDisplay from "../../components/ErrorDisplay"
import { LayoutGrid } from "lucide-react"
import { useVisualizerStore } from "../../store/useVisualizerStore"
import type { Algorithm } from "../../types"
import Header from "@/components/header"
import { Slider } from "@/components/ui/slider"

export default function PathfindingPage() {
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
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 transition-colors duration-300">
            <Header />
            <div className="container mx-auto px-4 max-w-7xl py-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 mb-16 text-center leading-tight py-2">
                    Pathfinding Visualizer
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2">
                        <Grid />
                        <div className="mt-6 flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-fuchsia-500"></div>
                                <span className="text-sm">Start Node</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-violet-500"></div>
                                <span className="text-sm">End Node</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-zinc-800 dark:bg-zinc-950"></div>
                                <span className="text-sm">Wall</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-fuchsia-200 dark:bg-fuchsia-900"></div>
                                <span className="text-sm">Visited Node</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-violet-300 dark:bg-violet-700"></div>
                                <span className="text-sm">Path Found</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-sm bg-blue-300 dark:bg-blue-700"></div>
                                <span className="text-sm">Weight Node</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8 pl-16">
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700">
                            <h2 className="text-lg font-semibold mb-4">Algorithm Controls</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Pick Algorithm</label>
                                    <select
                                        className="w-full p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600"
                                        value={currentAlgorithm}
                                        onChange={(e) => setCurrentAlgorithm(e.target.value as Algorithm)}
                                    >
                                        <option value="BFS">BFS</option>
                                        <option value="DFS">DFS</option>
                                        <option value="Dijkstra">Dijkstra</option>
                                        <option value="A*">A*</option>
                                        <option value="Greedy">Greedy</option>
                                        <option value="BellmanFord">Bellman-Ford</option>
                                        <option value="FloydWarshall">Floyd-Warshall</option>
                                        <option value="Bidirectional">Bidirectional</option>
                                        <option value="JumpPoint">Jump Point</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Set Speed</label>
                                    <Slider
                                        value={[speed]}
                                        min={1}
                                        max={10}
                                        step={1}
                                        onValueChange={(value: number[]) => setSpeed(value[0])}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleStart}
                                        disabled={isRunning}
                                        className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${isRunning
                                            ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:opacity-90"
                                            }`}
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={handlePause}
                                        disabled={!isRunning}
                                        className={`flex-1 py-2 rounded-lg font-medium transition-all duration-200 ${!isRunning
                                            ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90"
                                            }`}
                                    >
                                        {isPaused ? "Resume" : "Pause"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700">
                            <h2 className="text-lg font-semibold mb-4">Tools</h2>
                            <div className="space-y-4">
                                <button
                                    onClick={handleReset}
                                    className="w-full py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600"
                                >
                                    Reset Grid
                                </button>
                                <button
                                    onClick={generateRandomMap}
                                    disabled={isRunning}
                                    className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${isRunning
                                        ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90"
                                        }`}
                                >
                                    Generate Random Map
                                </button>
                            </div>
                        </div>

                        <AlgorithmInfo />
                    </div>
                </div>

                <ErrorDisplay />
            </div>
        </div>
    )
}
