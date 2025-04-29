import React from 'react';
import { Item } from '@/types/knapsack';
import { motion } from 'framer-motion';

interface BagVisualizationProps {
    items: Item[];
    maxWeight: number;
    currentWeight: number;
}

const BagVisualization: React.FC<BagVisualizationProps> = ({ items, maxWeight, currentWeight }) => {
    const weightPercentage = (currentWeight / maxWeight) * 100;
    const isOverweight = currentWeight > maxWeight;

    return (
        <div className="w-full">
            <div className="mb-4">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Bag Capacity</span>
                    <span className="text-sm">
                        {currentWeight.toFixed(1)} / {maxWeight} kg
                    </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${isOverweight ? 'bg-red-500' : 'bg-green-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(weightPercentage, 100)}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Items in Bag</h3>
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center bg-white/5 p-2 rounded"
                            >
                                <span className="font-medium">{item.name}</span>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm">Weight: {item.weight}kg</span>
                                    <span className="text-sm">Worth: ${item.worth}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Bag Statistics</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Weight:</span>
                            <span className={isOverweight ? 'text-red-500' : ''}>
                                {currentWeight.toFixed(1)} kg
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Max Capacity:</span>
                            <span>{maxWeight} kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Worth:</span>
                            <span>${items.reduce((sum, item) => sum + item.worth, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Items Count:</span>
                            <span>{items.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isOverweight && (
                <div className="mt-4 p-3 bg-red-500/20 text-red-500 rounded-lg">
                    Warning: The bag is overweight! Please remove some items.
                </div>
            )}
        </div>
    );
};

export default BagVisualization; 