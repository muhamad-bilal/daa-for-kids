import React from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';

const AlgorithmInfo: React.FC = () => {
    const { currentAlgorithm, algorithmInfo } = useVisualizerStore();
    const info = algorithmInfo[currentAlgorithm];

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-slate-700/50">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Algorithm Info
            </h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-slate-200 mb-2">{info.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {info.description}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Time Complexity</h4>
                        <p className="text-slate-200 font-mono">{info.timeComplexity}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Space Complexity</h4>
                        <p className="text-slate-200 font-mono">{info.spaceComplexity}</p>
                    </div>
                </div>
                <div className="pt-2">
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Optimality</h4>
                    <p className="text-slate-200">
                        {info.optimal ? (
                            <span className="text-green-400">Guaranteed optimal path</span>
                        ) : (
                            <span className="text-yellow-400">Not guaranteed optimal path</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AlgorithmInfo; 