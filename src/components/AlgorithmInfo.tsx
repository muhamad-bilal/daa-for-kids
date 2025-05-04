"use client"

import type React from "react"
import { useVisualizerStore } from "../store/useVisualizerStore"
import { motion } from "framer-motion"
import { Info, Check, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

const AlgorithmInfo: React.FC = () => {
    const { currentAlgorithm, algorithmInfo } = useVisualizerStore()
    const info = algorithmInfo[currentAlgorithm]
    const [isExpanded, setIsExpanded] = useState(true)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Info size={18} className="text-fuchsia-500" />
                    Algorithm Info
                </h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {isExpanded && (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-fuchsia-500 dark:text-fuchsia-400 mb-2">{info.name}</h3>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{info.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg">
                            <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Time Complexity</h4>
                            <p className="text-zinc-800 dark:text-zinc-200 font-mono">{info.timeComplexity}</p>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg">
                            <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Space Complexity</h4>
                            <p className="text-zinc-800 dark:text-zinc-200 font-mono">{info.spaceComplexity}</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Optimality</h4>
                        <div className="flex items-center gap-2">
                            {info.optimal ? (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                        <Check size={14} />
                                        Guaranteed optimal path
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <AlertTriangle size={14} />
                                        Not guaranteed optimal path
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Characteristics</h4>
                        <div className="flex flex-wrap gap-2">
                            {info.weighted && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                                    Weighted
                                </span>
                            )}
                            {info.unweighted && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300">
                                    Unweighted
                                </span>
                            )}
                            {info.complete && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                                    Complete
                                </span>
                            )}
                            {info.informed && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                                    Informed
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default AlgorithmInfo
