'use client';

export default function SplitMergePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Split and Merge Simulator
                </h1>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                        <p className="text-lg text-slate-300 mb-6">
                            The Split and Merge algorithm is commonly used in external sorting and database operations.
                            It involves dividing large datasets into smaller chunks that can fit in memory, sorting them,
                            and then merging them back together in a specific order.
                        </p>
                        {/* Visualization area will be added here */}
                        <div className="h-96 bg-slate-700/30 rounded-lg flex items-center justify-center">
                            <p className="text-slate-400">Visualization coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 