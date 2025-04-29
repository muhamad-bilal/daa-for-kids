import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Item } from '@/types/knapsack';

interface AIAssistantProps {
    items: Item[];
    maxWeight: number;
    currentWeight: number;
    algorithm: 'greedy' | 'dp' | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
    items,
    maxWeight,
    currentWeight,
    algorithm,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTip, setCurrentTip] = useState<string>('');

    const generateTip = () => {
        const tips = [
            {
                condition: () => items.length === 0,
                message: 'Try adding some items to the knapsack! You can use the "Generate Random Items" button to get started.',
            },
            {
                condition: () => currentWeight > maxWeight * 0.8,
                message: 'Your knapsack is getting quite full! Consider removing some less valuable items to make room for potentially better ones.',
            },
            {
                condition: () => items.some(item => item.worth / item.weight < 0.5),
                message: 'Some items have low value-to-weight ratios. Consider removing them to make room for more efficient items.',
            },
            {
                condition: () => algorithm === 'greedy',
                message: 'The greedy algorithm is fast but might not always find the optimal solution. Try the DP algorithm for better results!',
            },
            {
                condition: () => algorithm === 'dp',
                message: 'The DP algorithm finds the optimal solution but can be slower for large problems. Try the greedy algorithm for a quick approximation!',
            },
            {
                condition: () => true,
                message: 'Try comparing both algorithms to see which one works better for your specific problem!',
            },
        ];

        const applicableTip = tips.find(tip => tip.condition())?.message || '';
        setCurrentTip(applicableTip);
    };

    React.useEffect(() => {
        generateTip();
    }, [items, maxWeight, currentWeight, algorithm]);

    return (
        <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div
                    className="bg-blue-500 text-white p-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                                <span className="text-blue-500 text-lg">🤖</span>
                            </div>
                            <span className="font-semibold">Knapsack Assistant</span>
                        </div>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            ▼
                        </motion.div>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="p-4">
                                <p className="text-gray-700 mb-4">{currentTip}</p>
                                <button
                                    onClick={generateTip}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Get Another Tip
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default AIAssistant; 