'use client';

import React from 'react';
import Link from 'next/link';

export default function SortingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Sorting Visualizer
                    </h1>
                    <div className="w-24"></div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-slate-300 mb-4">
                            Coming Soon
                        </h2>
                        <p className="text-slate-400">
                            This visualizer will demonstrate various sorting algorithms including:
                        </p>
                        <ul className="mt-4 space-y-2 text-slate-300">
                            <li>• Quick Sort</li>
                            <li>• Merge Sort</li>
                            <li>• Bubble Sort</li>
                            <li>• Insertion Sort</li>
                            <li>• Selection Sort</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
} 