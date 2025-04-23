'use client';

import { useState } from 'react';

interface Item {
    id: number;
    name: string;
    weight: number;
    worth: number;
    required?: boolean;
}

export default function KnapsackPage() {
    const [maxWeight, setMaxWeight] = useState<number>(0);
    const [emptyBagWeight, setEmptyBagWeight] = useState<number>(0);
    const [items, setItems] = useState<Item[]>([]);
    const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: '', weight: 0, worth: 0 });
    const [requiredItems, setRequiredItems] = useState<Item[]>([]);
    const [algorithm, setAlgorithm] = useState<'greedy' | 'dp' | null>(null);
    const [solution, setSolution] = useState<{
        items: Item[];
        totalWeight: number;
        totalWorth: number;
        time: number;
    } | null>(null);

    const addItem = () => {
        if (currentItem.name && currentItem.weight > 0 && currentItem.worth > 0) {
            setItems([...items, { ...currentItem, id: items.length }]);
            setCurrentItem({ id: items.length + 1, name: '', weight: 0, worth: 0 });
        }
    };

    const addRequiredItem = () => {
        if (currentItem.name && currentItem.weight > 0 && currentItem.worth > 0) {
            setRequiredItems([...requiredItems, { ...currentItem, id: requiredItems.length, required: true }]);
            setCurrentItem({ id: items.length + 1, name: '', weight: 0, worth: 0 });
        }
    };

    const generateRandomItems = () => {
        const randomItems: Item[] = [];
        const itemCount = Math.floor(Math.random() * 10) + 5; // 5-15 items

        for (let i = 0; i < itemCount; i++) {
            randomItems.push({
                id: i,
                name: `Item ${i + 1}`,
                weight: Math.floor(Math.random() * 20) + 1,
                worth: Math.floor(Math.random() * 100) + 1
            });
        }

        setItems(randomItems);
    };

    const solveGreedy = () => {
        const startTime = performance.now();
        const sortedItems = [...items].sort((a, b) => b.worth - a.worth);
        let currentWeight = emptyBagWeight;
        let totalWorth = 0;
        const selectedItems: Item[] = [];

        // First add required items
        for (const item of requiredItems) {
            if (currentWeight + item.weight <= maxWeight) {
                currentWeight += item.weight;
                totalWorth += item.worth;
                selectedItems.push(item);
            } else {
                // If required items don't fit, solution is not possible
                setSolution(null);
                return;
            }
        }

        // Then add other items
        for (const item of sortedItems) {
            if (!item.required && currentWeight + item.weight <= maxWeight) {
                currentWeight += item.weight;
                totalWorth += item.worth;
                selectedItems.push(item);
            }
        }

        const endTime = performance.now();
        setSolution({
            items: selectedItems,
            totalWeight: currentWeight,
            totalWorth,
            time: endTime - startTime
        });
    };

    const solveDP = () => {
        const startTime = performance.now();
        const n = items.length;
        const capacity = maxWeight - emptyBagWeight;

        // First check if required items fit
        let requiredWeight = 0;
        let requiredWorth = 0;
        for (const item of requiredItems) {
            requiredWeight += item.weight;
            requiredWorth += item.worth;
        }

        if (requiredWeight > capacity) {
            setSolution(null);
            return;
        }

        // Create DP table
        const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

        // Fill DP table
        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= capacity; w++) {
                if (items[i - 1].weight <= w) {
                    dp[i][w] = Math.max(
                        dp[i - 1][w],
                        dp[i - 1][w - items[i - 1].weight] + items[i - 1].worth
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        // Find selected items
        let w = capacity;
        const selectedItems: Item[] = [...requiredItems];
        let totalWeight = requiredWeight;
        let totalWorth = requiredWorth;

        for (let i = n; i > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                selectedItems.push(items[i - 1]);
                w -= items[i - 1].weight;
                totalWeight += items[i - 1].weight;
                totalWorth += items[i - 1].worth;
            }
        }

        const endTime = performance.now();
        setSolution({
            items: selectedItems,
            totalWeight,
            totalWorth,
            time: endTime - startTime
        });
    };

    const compareAlgorithms = () => {
        const greedyStart = performance.now();
        solveGreedy();
        const greedyTime = performance.now() - greedyStart;

        const dpStart = performance.now();
        solveDP();
        const dpTime = performance.now() - dpStart;

        // You can add comparison visualization here
        console.log(`Greedy: ${greedyTime}ms, DP: ${dpTime}ms`);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Knapsack Problem Visualizer
                </h1>

                <div className="max-w-4xl mx-auto">
                    {/* Section 1: Bag Constraints */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Bag Constraints
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Max Weight Allowed</label>
                                <input
                                    type="number"
                                    value={maxWeight}
                                    onChange={(e) => setMaxWeight(Number(e.target.value))}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Empty Bag Weight</label>
                                <input
                                    type="number"
                                    value={emptyBagWeight}
                                    onChange={(e) => setEmptyBagWeight(Number(e.target.value))}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Items */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Items
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={currentItem.name}
                                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Weight</label>
                                <input
                                    type="number"
                                    value={currentItem.weight}
                                    onChange={(e) => setCurrentItem({ ...currentItem, weight: Number(e.target.value) })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Worth</label>
                                <input
                                    type="number"
                                    value={currentItem.worth}
                                    onChange={(e) => setCurrentItem({ ...currentItem, worth: Number(e.target.value) })}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={addItem}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Add Item
                                </button>
                                <button
                                    onClick={addRequiredItem}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Add Required
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between mb-4">
                            <button
                                onClick={generateRandomItems}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Generate Random Items
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            {requiredItems.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Required Items</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {requiredItems.map((item) => (
                                            <div key={item.id} className="bg-slate-700/30 p-4 rounded-lg">
                                                <p className="font-medium">{item.name}</p>
                                                <p>Weight: {item.weight}</p>
                                                <p>Worth: {item.worth}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold mb-2">All Items</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="bg-slate-700/30 p-4 rounded-lg">
                                            <p className="font-medium">{item.name}</p>
                                            <p>Weight: {item.weight}</p>
                                            <p>Worth: {item.worth}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Algorithm Selection */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50 mb-6">
                        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Select Algorithm
                        </h2>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    setAlgorithm('greedy');
                                    solveGreedy();
                                }}
                                className={`px-6 py-3 rounded-lg transition-colors ${algorithm === 'greedy'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                Greedy Algorithm
                            </button>
                            <button
                                onClick={() => {
                                    setAlgorithm('dp');
                                    solveDP();
                                }}
                                className={`px-6 py-3 rounded-lg transition-colors ${algorithm === 'dp'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                Dynamic Programming
                            </button>
                            <button
                                onClick={compareAlgorithms}
                                className="px-6 py-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                            >
                                Compare Algorithms
                            </button>
                        </div>
                    </div>

                    {/* Solution Display */}
                    {solution && (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                            <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Solution
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-700/30 p-4 rounded-lg">
                                    <p className="font-medium">Total Weight</p>
                                    <p>{solution.totalWeight}</p>
                                </div>
                                <div className="bg-slate-700/30 p-4 rounded-lg">
                                    <p className="font-medium">Total Worth</p>
                                    <p>{solution.totalWorth}</p>
                                </div>
                                <div className="bg-slate-700/30 p-4 rounded-lg">
                                    <p className="font-medium">Execution Time</p>
                                    <p>{solution.time.toFixed(2)} ms</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Selected Items</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {solution.items.map((item) => (
                                        <div key={item.id} className="bg-slate-700/30 p-4 rounded-lg">
                                            <p className="font-medium">{item.name}</p>
                                            <p>Weight: {item.weight}</p>
                                            <p>Worth: {item.worth}</p>
                                            {item.required && <p className="text-purple-400">Required</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 