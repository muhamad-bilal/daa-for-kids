import React, { useState, useEffect } from 'react';
import { Item, DPStep } from '@/types/knapsack';
import { Slider } from "@/components/ui/slider"

interface DPVisualizerProps {
    items: Item[];
    maxWeight: number;
    emptyBagWeight: number;
    onStepChange?: (step: number) => void;
}

const DPVisualizer: React.FC<DPVisualizerProps> = ({ items, maxWeight, emptyBagWeight, onStepChange }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [dpTable, setDpTable] = useState<DPStep[][]>([]);
    const [explanation, setExplanation] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(500); // milliseconds per step

    useEffect(() => {
        const n = items.length;
        const capacity = maxWeight;
        const table: DPStep[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(null));
        const steps: DPStep[] = [];

        // Initialize first row
        for (let w = 0; w <= capacity; w++) {
            table[0][w] = { i: 0, w, value: 0, selected: false };
        }

        // Fill the table
        for (let i = 1; i <= n; i++) {
            const item = items[i - 1];
            for (let w = 0; w <= capacity; w++) {
                if (item.weight > w) {
                    table[i][w] = { i, w, value: table[i - 1][w].value, selected: false };
                } else {
                    const valueWithItem = table[i - 1][w - item.weight].value + item.worth;
                    const valueWithoutItem = table[i - 1][w].value;

                    if (valueWithItem > valueWithoutItem) {
                        table[i][w] = { i, w, value: valueWithItem, selected: true };
                    } else {
                        table[i][w] = { i, w, value: valueWithoutItem, selected: false };
                    }
                }
                steps.push(table[i][w]);
            }
        }

        setDpTable(table);
        setCurrentStep(0);
        if (onStepChange) onStepChange(0);
    }, [items, maxWeight]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && currentStep < dpTable.flat().length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                if (onStepChange) onStepChange(currentStep + 1);
            }, playSpeed);
        } else if (currentStep >= dpTable.flat().length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, dpTable, playSpeed]);

    const handleNextStep = () => {
        if (currentStep < dpTable.flat().length - 1) {
            setCurrentStep(prev => prev + 1);
            if (onStepChange) onStepChange(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            if (onStepChange) onStepChange(currentStep - 1);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaySpeed(1000 - Number(e.target.value));
    };

    useEffect(() => {
        const step = dpTable.flat()[currentStep];
        if (!step) return;

        const item = items[step.i - 1];
        if (!item) {
            setExplanation('Initializing the table with zero values for empty knapsack.');
            return;
        }

        if (item.weight > step.w) {
            setExplanation(`Item ${item.name} (weight: ${item.weight}kg) is too heavy for capacity ${step.w}kg. Using previous value.`);
        } else {
            const valueWithItem = dpTable[step.i - 1][step.w - item.weight].value + item.worth;
            const valueWithoutItem = dpTable[step.i - 1][step.w].value;

            if (valueWithItem > valueWithoutItem) {
                setExplanation(`Including ${item.name} (weight: ${item.weight}kg, worth: $${item.worth}) gives better value ($${valueWithItem}) than not including it ($${valueWithoutItem}).`);
            } else {
                setExplanation(`Not including ${item.name} (weight: ${item.weight}kg, worth: $${item.worth}) gives better value ($${valueWithoutItem}) than including it ($${valueWithItem}).`);
            }
        }
    }, [currentStep, dpTable, items]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Dynamic Programming Table</div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Speed:</span>
                        <Slider
                            value={[1000 - playSpeed]}
                            onValueChange={(value) => setPlaySpeed(1000 - value[0])}
                            max={900}
                            step={100}
                            className="w-24"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrevStep}
                            disabled={currentStep === 0}
                            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={togglePlay}
                            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={currentStep === dpTable.flat().length - 1}
                            className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Step {currentStep + 1} of {dpTable.flat().length}</div>
                <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">{explanation}</div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border border-zinc-200 dark:border-zinc-700 p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">Item</th>
                                {Array.from({ length: maxWeight + 1 }, (_, i) => (
                                    <th key={i} className="border border-zinc-200 dark:border-zinc-700 p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{i}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dpTable.map((row, i) => (
                                <tr key={i}>
                                    <td className="border border-zinc-200 dark:border-zinc-700 p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                                        {i === 0 ? 'Empty' : items[i - 1].name}
                                    </td>
                                    {row.map((cell, j) => {
                                        const isCurrentStep = currentStep === (i * (maxWeight + 1) + j);
                                        const isUpdated = isCurrentStep && cell.value !== dpTable[i][j].value;
                                        return (
                                            <td
                                                key={j}
                                                className={`border border-zinc-200 dark:border-zinc-700 p-2 text-zinc-700 dark:text-zinc-300
                                                    ${isCurrentStep ? 'bg-violet-500/70 dark:bg-violet-500/70' : ''} 
                                                    ${isUpdated ? 'ring-2 ring-yellow-500 dark:ring-yellow-400' : ''}
                                                    ${cell.selected ? 'bg-fuchsia-500/20 dark:bg-fuchsia-500/30' : ''}
                                                    ${i === 0 ? 'bg-zinc-50 dark:bg-zinc-900' : 'bg-white dark:bg-zinc-800'}`}
                                            >
                                                {cell.value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <Slider
                    value={[currentStep]}
                    onValueChange={(value) => {
                        setCurrentStep(value[0]);
                        onStepChange?.(value[0]);
                    }}
                    max={dpTable.flat().length - 1}
                    step={1}
                    className="flex-1"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[60px] text-right">
                    Step {currentStep + 1} of {dpTable.flat().length}
                </span>
            </div>
        </div>
    );
};

export default DPVisualizer; 