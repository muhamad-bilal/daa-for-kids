'use client';

import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Design and Analysis of Algorithms
                    </h1>
                    <p className="text-lg text-slate-300">
                        Interactive visualization tools for understanding algorithm behavior and performance
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Link
                        href="/pathfinding"
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 hover:border-blue-500 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                            Pathfinding Algorithms
                        </h2>
                        <p className="text-slate-300">
                            Visualize and compare different pathfinding algorithms like Dijkstra's, A*, and more in action
                        </p>
                    </Link>

                    <Link
                        href="/knapsack"
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 hover:border-blue-500 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                            Knapsack Problem
                        </h2>
                        <p className="text-slate-300">
                            Explore dynamic programming solutions to the classic 0/1 Knapsack problem with interactive visualization
                        </p>
                    </Link>

                    <Link
                        href="/split-merge"
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 hover:border-blue-500 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                            Split and Merge Simulator
                        </h2>
                        <p className="text-slate-300">
                            Visualize the split and merge algorithm for external sorting and database operations
                        </p>
                    </Link>

                    <Link
                        href="/search"
                        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 hover:border-blue-500 transition-all duration-300"
                    >
                        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                            Search Algorithms
                        </h2>
                        <p className="text-slate-300">
                            Visualize search algorithms like Binary Search, Linear Search, and more
                        </p>
                    </Link>
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-700/50">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-xl font-semibold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Contributors
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <a
                                href="https://github.com/muhamad-bilal"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span>Muhammad Bilal</span>
                            </a>
                            <a
                                href="https://github.com/rimocide"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span>Abdullah Mustafa</span>
                            </a>
                            <a
                                href="https://github.com/MoUmerSami2004"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span>Muhammad Umer Sami</span>
                            </a>
                            <a
                                href="https://github.com/moti987"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span>Hamza Motiwala</span>
                            </a>
                            <a
                                href="https://github.com/moti987"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                <span>Zerish</span>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
} 