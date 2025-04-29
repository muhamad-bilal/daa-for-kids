import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Item, AlgorithmStep, DPStep } from '@/types/knapsack';

interface AlgorithmVisualizerProps {
    algorithm: 'greedy' | 'dp';
    items: Item[];
    maxWeight: number;
    onStepChange?: (step: number) => void;
}

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
    algorithm,
    items,
    maxWeight,
    onStepChange,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<AlgorithmStep[]>([]);
    const [dpTable, setDpTable] = useState<DPStep[][]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (algorithm === 'greedy') {
            // Sort by value-to-weight ratio
            const sortedItems = [...items].sort((a, b) => {
                const ratioA = a.worth / a.weight;
                const ratioB = b.worth / b.weight;
                return ratioB - ratioA;
            });
            let currentWeight = 0;
            let currentWorth = 0;
            const newSteps: AlgorithmStep[] = [];

            for (const item of sortedItems) {
                const ratio = (item.worth / item.weight).toFixed(2);
                if (currentWeight + item.weight <= maxWeight) {
                    newSteps.push({
                        item,
                        action: 'select',
                        reason: `Item fits and has high value-to-weight ratio (${ratio})`,
                        currentWeight: currentWeight + item.weight,
                        currentWorth: currentWorth + item.worth,
                    });
                    currentWeight += item.weight;
                    currentWorth += item.worth;
                } else {
                    newSteps.push({
                        item,
                        action: 'skip',
                        reason: `Item would exceed maximum weight (ratio: ${ratio})`,
                        currentWeight,
                        currentWorth,
                    });
                }
            }

            setSteps(newSteps);
        } else {
            // DP visualization
            const n = items.length;
            const dp: number[] = Array(maxWeight + 1).fill(0);
            const dpSteps: DPStep[][] = Array(n + 1).fill(0).map(() =>
                Array(maxWeight + 1).fill(0).map(() => ({ i: 0, w: 0, value: 0, selected: false }))
            );

            for (let i = 1; i <= n; i++) {
                const item = items[i - 1];
                for (let w = maxWeight; w >= item.weight; w--) {
                    const newValue = dp[w - item.weight] + item.worth;
                    if (newValue > dp[w]) {
                        dp[w] = newValue;
                        dpSteps[i][w] = {
                            i,
                            w,
                            value: dp[w],
                            selected: true,
                        };
                    } else {
                        dpSteps[i][w] = {
                            i,
                            w,
                            value: dp[w],
                            selected: false,
                        };
                    }
                }
            }

            setDpTable(dpSteps);
        }
    }, [algorithm, items, maxWeight]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < (algorithm === 'greedy' ? steps.length : dpTable.length)) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    const next = prev + 1;
                    if (onStepChange) onStepChange(next);
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length, dpTable.length, algorithm, onStepChange]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleStepForward = () => {
        if (currentStep < (algorithm === 'greedy' ? steps.length : dpTable.length)) {
            setCurrentStep((prev) => {
                const next = prev + 1;
                if (onStepChange) onStepChange(next);
                return next;
            });
        }
    };

    const handleStepBackward = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => {
                const next = prev - 1;
                if (onStepChange) onStepChange(next);
                return next;
            });
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                    <button
                        onClick={handleStepBackward}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        ←
                    </button>
                    <button
                        onClick={handlePlayPause}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button
                        onClick={handleStepForward}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        →
                    </button>
                </div>
                <div className="text-sm text-gray-600">
                    Step {currentStep + 1} of {algorithm === 'greedy' ? steps.length : dpTable.length}
                </div>
            </div>

            {algorithm === 'greedy' ? (
                <AnimatePresence mode="wait">
                    {steps.slice(0, currentStep + 1).map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`p-4 mb-2 rounded-lg ${step.action === 'select' ? 'bg-green-100' : 'bg-red-100'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-medium">{step.item.name}</span>
                                    <span className="ml-2 text-sm text-gray-600">
                                        (W: {step.item.weight}, V: {step.item.worth})
                                    </span>
                                </div>
                                <span className={`px-2 py-1 rounded text-sm ${step.action === 'select' ? 'bg-green-200' : 'bg-red-200'
                                    }`}>
                                    {step.action.toUpperCase()}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">{step.reason}</div>
                            <div className="mt-2 text-sm">
                                Current Weight: {step.currentWeight}/{maxWeight}
                                <br />
                                Current Worth: {step.currentWorth}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2">Item</th>
                                {Array.from({ length: maxWeight + 1 }, (_, i) => (
                                    <th key={i} className="border p-2">{i}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dpTable.slice(0, currentStep + 1).map((row, i) => (
                                <tr key={i}>
                                    <td className="border p-2">Item {i}</td>
                                    {row.map((cell, w) => (
                                        <td
                                            key={w}
                                            className={`border p-2 ${cell.selected ? 'bg-green-100' : ''
                                                }`}
                                        >
                                            {cell.value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AlgorithmVisualizer; 