'use client';

import React from 'react';
import Grid from '../../components/Grid';
import Controls from '../../components/Controls';
import AlgorithmInfo from '../../components/AlgorithmInfo';
import ErrorDisplay from '../../components/ErrorDisplay';
import Link from 'next/link';

export default function PathfindingPage() {
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
                        Pathfinding Visualizer
                    </h1>
                    <div className="w-24"></div> {/* Spacer for alignment */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                            <Grid />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Controls />
                        <AlgorithmInfo />
                    </div>
                </div>

                <ErrorDisplay />
            </div>
        </main>
    );
} 