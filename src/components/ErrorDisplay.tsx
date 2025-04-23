import React from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';

const ErrorDisplay: React.FC = () => {
    const { error } = useVisualizerStore();

    if (!error) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg border border-red-400/50 animate-slide-up">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{error}</p>
            </div>
        </div>
    );
};

export default ErrorDisplay; 