import React from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { Algorithm } from '../types';

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
    } = useVisualizerStore();

    const algorithms: Algorithm[] = [
        'BFS',
        'DFS',
        'Dijkstra',
        'A*',
        'Greedy',
        'BellmanFord',
        'FloydWarshall',
        'Bidirectional',
        'JumpPoint',
    ];

    const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentAlgorithm(e.target.value as Algorithm);
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeed(Number(e.target.value));
    };

    const handleStart = () => {
        setIsRunning(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const handleReset = () => {
        resetGrid();
        setIsRunning(false);
        setIsPaused(false);
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                        Controls
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="algorithm" className="block text-sm font-medium text-slate-300">
                                Algorithm
                            </label>
                            <select
                                id="algorithm"
                                value={currentAlgorithm}
                                onChange={handleAlgorithmChange}
                                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                            <label htmlFor="speed" className="block text-sm font-medium text-slate-300">
                                Visualization Speed
                            </label>
                            <input
                                id="speed"
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={handleSpeedChange}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
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
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25"
                        >
                            Start
                        </button>
                        <button
                            onClick={handlePause}
                            disabled={!isRunning}
                            className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-yellow-500/25"
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/25"
                        >
                            Reset
                        </button>
                        <button
                            onClick={generateRandomMap}
                            disabled={isRunning}
                            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25"
                        >
                            Random Map
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Controls; 