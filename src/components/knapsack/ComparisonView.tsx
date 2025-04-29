import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Item, KnapsackSolution } from '@/types/knapsack';

interface ComparisonViewProps {
    greedySolution: KnapsackSolution;
    dpSolution: KnapsackSolution;
    items: Item[];
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
    greedySolution,
    dpSolution,
    items,
}) => {
    const comparisonData = [
        {
            name: 'Greedy',
            weight: greedySolution.totalWeight,
            worth: greedySolution.totalWorth,
            efficiency: greedySolution.totalWorth / greedySolution.totalWeight,
            time: greedySolution.time,
        },
        {
            name: 'Dynamic Programming',
            weight: dpSolution.totalWeight,
            worth: dpSolution.totalWorth,
            efficiency: dpSolution.totalWorth / dpSolution.totalWeight,
            time: dpSolution.time,
        },
    ];

    const itemEfficiencyData = items.map(item => ({
        name: item.name,
        efficiency: item.worth / item.weight,
        weight: item.weight,
        worth: item.worth,
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Greedy Solution</h3>
                    <div className="space-y-2">
                        <p>Total Weight: {greedySolution.totalWeight}</p>
                        <p>Total Worth: {greedySolution.totalWorth}</p>
                        <p>Execution Time: {greedySolution.time.toFixed(2)}ms</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">DP Solution</h3>
                    <div className="space-y-2">
                        <p>Total Weight: {dpSolution.totalWeight}</p>
                        <p>Total Worth: {dpSolution.totalWorth}</p>
                        <p>Execution Time: {dpSolution.time.toFixed(2)}ms</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Algorithm Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="worth" fill="#8884d8" name="Total Worth" />
                        <Bar dataKey="weight" fill="#82ca9d" name="Total Weight" />
                        <Bar dataKey="efficiency" fill="#ffc658" name="Efficiency (Worth/Weight)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Item Efficiency Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={itemEfficiencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency (Worth/Weight)" />
                        <Bar dataKey="worth" fill="#82ca9d" name="Worth" />
                        <Bar dataKey="weight" fill="#ffc658" name="Weight" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ComparisonView; 