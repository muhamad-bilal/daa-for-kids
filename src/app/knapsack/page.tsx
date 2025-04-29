'use client';

import { useState, useEffect } from 'react';
import BagVisualization from '@/components/knapsack/BagVisualization';
import DPVisualizer from '@/components/knapsack/DPVisualizer';
import { Item, KnapsackSolution } from '@/types/knapsack';

const REALISTIC_ITEMS = [
    'Laptop', 'Smartphone', 'Camera', 'Headphones', 'Tablet', 'Watch',
    'Water Bottle', 'Snacks', 'First Aid Kit', 'Flashlight', 'Multi-tool',
    'Notebook', 'Pen', 'Sunglasses', 'Umbrella', 'Jacket', 'Shoes',
    'Charger', 'Power Bank', 'Books', 'Maps', 'Compass', 'Tent',
    'Sleeping Bag', 'Cooking Set', 'Food', 'Drinks', 'Medicines'
];

export default function KnapsackPage() {
    const [maxWeight, setMaxWeight] = useState<number>(0);
    const [emptyBagWeight, setEmptyBagWeight] = useState<number>(0);
    const [items, setItems] = useState<Item[]>([]);
    const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: '', weight: 0, worth: 0 });
    const [requiredItems, setRequiredItems] = useState<Item[]>([]);
    const [algorithm, setAlgorithm] = useState<'greedy' | 'dp' | null>(null);
    const [greedySolution, setGreedySolution] = useState<KnapsackSolution | null>(null);
    const [dpSolution, setDpSolution] = useState<KnapsackSolution | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [aiAdvice, setAiAdvice] = useState<string>('');

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

    const generateRandomItems = (preset: 'heavy' | 'light' | 'mixed' = 'mixed') => {
        const randomItems: Item[] = [];
        const itemCount = Math.floor(Math.random() * 10) + 5; // 5-15 items
        const availableItems = [...REALISTIC_ITEMS];

        for (let i = 0; i < itemCount; i++) {
            let weight, worth;
            switch (preset) {
                case 'heavy':
                    weight = Math.floor(Math.random() * 30) + 10;
                    worth = Math.floor(Math.random() * 50) + 20;
                    break;
                case 'light':
                    weight = Math.floor(Math.random() * 10) + 1;
                    worth = Math.floor(Math.random() * 20) + 5;
                    break;
                default: // mixed
                    weight = Math.floor(Math.random() * 20) + 1;
                    worth = Math.floor(Math.random() * 100) + 1;
            }

            const randomIndex = Math.floor(Math.random() * availableItems.length);
            const name = availableItems.splice(randomIndex, 1)[0];

            randomItems.push({
                id: i,
                name,
                weight,
                worth
            });
        }

        setItems(randomItems);
    };

    const randomizeAll = () => {
        setMaxWeight(Math.floor(Math.random() * 50) + 20);
        setEmptyBagWeight(Math.floor(Math.random() * 5) + 1);
        generateRandomItems('mixed');
    };

    const solveGreedy = () => {
        const startTime = performance.now();
        const sortedItems = [...items].sort((a, b) => {
            const ratioA = a.worth / a.weight;
            const ratioB = b.worth / b.weight;
            return ratioB - ratioA;
        });
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
                setGreedySolution(null);
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
        setGreedySolution({
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
            setDpSolution(null);
            return;
        }

        // Create DP table with reduced memory usage
        const dp: number[] = Array(capacity + 1).fill(0);
        const selected: boolean[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(false));

        // Fill DP table
        for (let i = 1; i <= n; i++) {
            const item = items[i - 1];
            for (let w = capacity; w >= item.weight; w--) {
                const newValue = dp[w - item.weight] + item.worth;
                if (newValue > dp[w]) {
                    dp[w] = newValue;
                    selected[i][w] = true;
                }
            }
        }

        // Find selected items
        let w = capacity;
        const selectedItems: Item[] = [...requiredItems];
        let totalWeight = requiredWeight;
        let totalWorth = requiredWorth;

        for (let i = n; i > 0; i--) {
            if (selected[i][w]) {
                selectedItems.push(items[i - 1]);
                w -= items[i - 1].weight;
                totalWeight += items[i - 1].weight;
                totalWorth += items[i - 1].worth;
            }
        }

        const endTime = performance.now();
        setDpSolution({
            items: selectedItems,
            totalWeight,
            totalWorth,
            time: endTime - startTime
        });
    };

    const compareAlgorithms = () => {
        solveGreedy();
        solveDP();
        setShowComparison(true);
    };

    const currentWeight = (algorithm === 'greedy' ? greedySolution : dpSolution)?.totalWeight || 0;

    useEffect(() => {
        // Update AI advice based on current state
        let advice = '';

        if (items.length === 0) {
            advice = 'Add some items to your knapsack to get started.';
        } else if (currentWeight > maxWeight) {
            advice = 'Your knapsack is overweight! Consider removing some items or using a different combination.';
        } else if (algorithm === 'greedy') {
            const sortedItems = [...items].sort((a, b) => (b.worth / b.weight) - (a.worth / a.weight));
            const bestItem = sortedItems[0];
            advice = `The Greedy algorithm prioritizes items with the best value-to-weight ratio. Currently, ${bestItem.name} has the best ratio of ${(bestItem.worth / bestItem.weight).toFixed(2)}.`;
        } else if (algorithm === 'dp') {
            advice = 'The Dynamic Programming approach considers all possible combinations to find the optimal solution. Watch how the table fills up step by step.';
        }

        setAiAdvice(advice);
    }, [items, currentWeight, maxWeight, algorithm]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Knapsack Problem Visualizer
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Left Column: Input and Items */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Bag Constraints */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
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

                        {/* Items Section */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
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
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => generateRandomItems('heavy')}
                                        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs"
                                    >
                                        Heavy Items
                                    </button>
                                    <button
                                        onClick={() => generateRandomItems('light')}
                                        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs"
                                    >
                                        Light Items
                                    </button>
                                    <button
                                        onClick={() => generateRandomItems('mixed')}
                                        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs"
                                    >
                                        Mixed Items
                                    </button>
                                </div>
                                <button
                                    onClick={randomizeAll}
                                    className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-xs"
                                >
                                    Randomize All
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

                        {/* AI Assistance */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                            <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
                            <div className="bg-blue-500/10 p-4 rounded-lg">
                                <p className="text-sm">{aiAdvice}</p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Visualization */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Bag Visualization */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                            <BagVisualization
                                items={algorithm === 'greedy' ? greedySolution?.items || [] : dpSolution?.items || []}
                                maxWeight={maxWeight}
                                currentWeight={currentWeight}
                            />
                        </div>

                        {/* Algorithm Selection */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
                            <h2 className="text-2xl font-semibold mb-4">Algorithm Selection</h2>
                            <div className="flex space-x-4 mb-4">
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
                            </div>

                            {algorithm === 'greedy' && greedySolution && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Greedy Algorithm Steps</h3>
                                    <div className="space-y-4">
                                        {items
                                            .sort((a, b) => (b.worth / b.weight) - (a.worth / a.weight))
                                            .map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className={`p-4 rounded-lg ${greedySolution.items.some(i => i.id === item.id)
                                                        ? 'bg-green-500/20'
                                                        : 'bg-slate-700/30'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-sm text-slate-400 ml-2">
                                                                (Ratio: {(item.worth / item.weight).toFixed(2)})
                                                            </span>
                                                        </div>
                                                        <div className="text-sm">
                                                            Weight: {item.weight}kg | Worth: ${item.worth}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {algorithm === 'dp' && (
                                <DPVisualizer
                                    items={items}
                                    maxWeight={maxWeight}
                                    onStepChange={setCurrentStep}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 