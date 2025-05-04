"use client"

import { useState, useEffect } from "react"
import BagVisualization from "@/components/knapsack/BagVisualization"
import DPVisualizer from "@/components/knapsack/DPVisualizer"
import type { Item, KnapsackSolution } from "@/types/knapsack"
import Link from "next/link"
import {
    ChevronLeft,
    Lightbulb,
    Plus,
    Briefcase,
    ShoppingBag,
    Sparkles,
    Info,
    ArrowRight,
    Trash2,
    Calculator,
    BarChart4,
    Scale,
    DollarSign,
} from "lucide-react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"

const REALISTIC_ITEMS = [
    "Laptop",
    "Smartphone",
    "Camera",
    "Headphones",
    "Tablet",
    "Watch",
    "Water Bottle",
    "Snacks",
    "First Aid Kit",
    "Flashlight",
    "Multi-tool",
    "Notebook",
    "Pen",
    "Sunglasses",
    "Umbrella",
    "Jacket",
    "Shoes",
    "Charger",
    "Power Bank",
    "Books",
    "Maps",
    "Compass",
    "Tent",
    "Sleeping Bag",
    "Cooking Set",
    "Food",
    "Drinks",
    "Medicines",
]

export default function KnapsackPage() {
    const [maxWeight, setMaxWeight] = useState<number>(20)
    const [emptyBagWeight, setEmptyBagWeight] = useState<number>(1)
    const [items, setItems] = useState<Item[]>([])
    const [currentItem, setCurrentItem] = useState<Item>({ id: 0, name: "", weight: 0, worth: 0 })
    const [requiredItems, setRequiredItems] = useState<Item[]>([])
    const [algorithm, setAlgorithm] = useState<"greedy" | "dp" | null>(null)
    const [greedySolution, setGreedySolution] = useState<KnapsackSolution | null>(null)
    const [dpSolution, setDpSolution] = useState<KnapsackSolution | null>(null)
    const [showComparison, setShowComparison] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [aiAdvice, setAiAdvice] = useState<string>("")
    const [activeTab, setActiveTab] = useState("setup")

    // Initialize with some random items for better first-time experience
    useEffect(() => {
        if (items.length === 0) {
            randomizeAll()
        }
    }, [])

    const addItem = () => {
        if (currentItem.name && currentItem.weight > 0 && currentItem.worth > 0) {
            setItems([...items, { ...currentItem, id: items.length }])
            setCurrentItem({ id: items.length + 1, name: "", weight: 0, worth: 0 })
        }
    }

    const addRequiredItem = () => {
        if (currentItem.name && currentItem.weight > 0 && currentItem.worth > 0) {
            setRequiredItems([...requiredItems, { ...currentItem, id: requiredItems.length, required: true }])
            setCurrentItem({ id: items.length + 1, name: "", weight: 0, worth: 0 })
        }
    }

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id))
    }

    const removeRequiredItem = (id: number) => {
        setRequiredItems(requiredItems.filter(item => item.id !== id))
    }

    const generateRandomItems = (preset: "heavy" | "light" | "mixed" = "mixed") => {
        const randomItems: Item[] = []
        const itemCount = Math.floor(Math.random() * 10) + 5 // 5-15 items
        const availableItems = [...REALISTIC_ITEMS]

        for (let i = 0; i < itemCount; i++) {
            let weight, worth
            switch (preset) {
                case "heavy":
                    weight = Math.floor(Math.random() * 30) + 10
                    worth = Math.floor(Math.random() * 50) + 20
                    break
                case "light":
                    weight = Math.floor(Math.random() * 10) + 1
                    worth = Math.floor(Math.random() * 20) + 5
                    break
                default: // mixed
                    weight = Math.floor(Math.random() * 20) + 1
                    worth = Math.floor(Math.random() * 100) + 1
            }

            const randomIndex = Math.floor(Math.random() * availableItems.length)
            const name = availableItems.splice(randomIndex, 1)[0] || `Item ${i + 1}`

            randomItems.push({
                id: i,
                name,
                weight,
                worth,
            })
        }

        setItems(randomItems)
    }

    const randomizeAll = () => {
        setMaxWeight(Math.floor(Math.random() * 50) + 20)
        setEmptyBagWeight(Math.floor(Math.random() * 5) + 1)
        generateRandomItems("mixed")
        setRequiredItems([])
    }

    const solveGreedy = () => {
        const startTime = performance.now()
        const sortedItems = [...items].sort((a, b) => {
            const ratioA = a.worth / a.weight
            const ratioB = b.worth / b.weight
            return ratioB - ratioA
        })
        let currentWeight = emptyBagWeight
        let totalWorth = 0
        const selectedItems: Item[] = []

        // First add required items
        for (const item of requiredItems) {
            if (currentWeight + item.weight <= maxWeight) {
                currentWeight += item.weight
                totalWorth += item.worth
                selectedItems.push(item)
            } else {
                setGreedySolution(null)
                return
            }
        }

        // Then add other items
        for (const item of sortedItems) {
            if (!item.required && currentWeight + item.weight <= maxWeight) {
                currentWeight += item.weight
                totalWorth += item.worth
                selectedItems.push(item)
            }
        }

        const endTime = performance.now()
        setGreedySolution({
            items: selectedItems,
            totalWeight: currentWeight,
            totalWorth,
            time: endTime - startTime,
        })

        // Automatically switch to results tab
        setActiveTab("results")
    }

    const solveDP = () => {
        const startTime = performance.now()
        const n = items.length
        const capacity = maxWeight - emptyBagWeight

        // First check if required items fit
        let requiredWeight = 0
        let requiredWorth = 0
        for (const item of requiredItems) {
            requiredWeight += item.weight
            requiredWorth += item.worth
        }

        if (requiredWeight > capacity) {
            setDpSolution(null)
            return
        }

        // Create DP table with reduced memory usage
        const dp: number[] = Array(capacity + 1).fill(0)
        const selected: boolean[][] = Array(n + 1)
            .fill(null)
            .map(() => Array(capacity + 1).fill(false))

        // Fill DP table
        for (let i = 1; i <= n; i++) {
            const item = items[i - 1]
            for (let w = capacity; w >= item.weight; w--) {
                const newValue = dp[w - item.weight] + item.worth
                if (newValue > dp[w]) {
                    dp[w] = newValue
                    selected[i][w] = true
                }
            }
        }

        // Find selected items
        let w = capacity
        const selectedItems: Item[] = [...requiredItems]
        let totalWeight = requiredWeight
        let totalWorth = requiredWorth

        for (let i = n; i > 0; i--) {
            if (selected[i][w]) {
                selectedItems.push(items[i - 1])
                w -= items[i - 1].weight
                totalWeight += items[i - 1].weight
                totalWorth += items[i - 1].worth
            }
        }

        const endTime = performance.now()
        setDpSolution({
            items: selectedItems,
            totalWeight,
            totalWorth,
            time: endTime - startTime,
        })

        // Automatically switch to results tab
        setActiveTab("results")
    }

    const compareAlgorithms = () => {
        solveGreedy()
        solveDP()
        setShowComparison(true)
        setActiveTab("comparison")
    }

    const currentWeight = (algorithm === "greedy" ? greedySolution : dpSolution)?.totalWeight || 0
    const currentSolution = algorithm === "greedy" ? greedySolution : dpSolution

    useEffect(() => {
        // Update AI advice based on current state
        let advice = ""

        if (items.length === 0) {
            advice = "Add some items to your knapsack to get started."
        } else if (currentWeight > maxWeight) {
            advice = "Your knapsack is overweight! Consider removing some items or using a different combination."
        } else if (algorithm === "greedy") {
            const sortedItems = [...items].sort((a, b) => b.worth / b.weight - a.worth / a.weight)
            const bestItem = sortedItems[0]
            advice = `The Greedy algorithm prioritizes items with the best value-to-weight ratio. Currently, ${bestItem.name
                } has the best ratio of ${(bestItem.worth / bestItem.weight).toFixed(2)}.`
        } else if (algorithm === "dp") {
            advice =
                "The Dynamic Programming approach considers all possible combinations to find the optimal solution. Watch how the table fills up step by step."
        } else if (items.length > 0 && !algorithm) {
            advice = "You have items ready to go! Choose an algorithm to solve the knapsack problem."
        }

        setAiAdvice(advice)
    }, [items, currentWeight, maxWeight, algorithm])

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 transition-colors duration-300">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 text-center mb-16">
                    Knapsack Problem Visualizer
                </h1>
                <div className="w-24"></div> {/* Spacer for alignment */}

                {/* AI Assistant - Always visible for guidance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 border border-zinc-200 dark:border-zinc-700 mb-6"
                >
                    <div className="flex items-start gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                            <Lightbulb className="text-amber-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-1">AI Assistant</h2>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{aiAdvice}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="setup" className="flex items-center gap-2">
                            <Briefcase size={16} />
                            <span className="hidden sm:inline">Problem Setup</span>
                            <span className="sm:hidden">Setup</span>
                        </TabsTrigger>
                        <TabsTrigger value="solve" className="flex items-center gap-2">
                            <Calculator size={16} />
                            <span className="hidden sm:inline">Solve Problem</span>
                            <span className="sm:hidden">Solve</span>
                        </TabsTrigger>
                        <TabsTrigger value="results" className="flex items-center gap-2">
                            <BarChart4 size={16} />
                            <span className="hidden sm:inline">View Results</span>
                            <span className="sm:hidden">Results</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Problem Setup Tab */}
                    <TabsContent value="setup" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bag Constraints */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingBag className="text-fuchsia-500" size={20} />
                                    Bag Constraints
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                            Max Weight Allowed
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={maxWeight}
                                                onChange={(e) => setMaxWeight(Number(e.target.value))}
                                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                            />
                                            <Scale className="ml-2 text-zinc-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                            Empty Bag Weight
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={emptyBagWeight}
                                                onChange={(e) => setEmptyBagWeight(Number(e.target.value))}
                                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                            />
                                            <Scale className="ml-2 text-zinc-400" size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={randomizeAll}
                                        className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 text-white rounded-lg transition-colors py-2 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={16} />
                                        Randomize Everything
                                    </button>
                                </div>
                            </motion.div>

                            {/* Add Items */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Briefcase className="text-fuchsia-500" size={20} />
                                    Add New Item
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                            Item Name
                                        </label>
                                        <input
                                            type="text"
                                            value={currentItem.name}
                                            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                            placeholder="e.g., Laptop, Camera, etc."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                                Weight
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={currentItem.weight}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, weight: Number(e.target.value) })}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                                    placeholder="Weight"
                                                />
                                                <Scale className="ml-2 text-zinc-400" size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                                                Worth
                                            </label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={currentItem.worth}
                                                    onChange={(e) => setCurrentItem({ ...currentItem, worth: Number(e.target.value) })}
                                                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                                    placeholder="Value"
                                                />
                                                <DollarSign className="ml-2 text-zinc-400" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={addItem}
                                        className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Item
                                    </button>
                                    <button
                                        onClick={addRequiredItem}
                                        className="bg-violet-500 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Required
                                    </button>
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => generateRandomItems("heavy")}
                                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors text-xs"
                                        >
                                            Heavy Items
                                        </button>
                                        <button
                                            onClick={() => generateRandomItems("light")}
                                            className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors text-xs"
                                        >
                                            Light Items
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => generateRandomItems("mixed")}
                                        className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors text-xs"
                                    >
                                        Mixed Items
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Items List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                        >
                            <h2 className="text-xl font-semibold mb-6">Item Inventory</h2>

                            <div className="space-y-6">
                                {requiredItems.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 text-fuchsia-500 dark:text-fuchsia-400 flex items-center gap-2">
                                            <span className="inline-block w-3 h-3 bg-fuchsia-500 rounded-full"></span>
                                            Required Items
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {requiredItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-lg border border-fuchsia-100 dark:border-fuchsia-800/30 relative group"
                                                >
                                                    <button
                                                        onClick={() => removeRequiredItem(item.id)}
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <p className="font-medium">{item.name}</p>
                                                    <div className="flex justify-between mt-2 text-sm">
                                                        <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                                            <Scale size={14} /> {item.weight}
                                                        </p>
                                                        <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                                            <DollarSign size={14} /> {item.worth}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                                                        Ratio: {(item.worth / item.weight).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-violet-500 dark:text-violet-400 flex items-center gap-2">
                                        <span className="inline-block w-3 h-3 bg-violet-500 rounded-full"></span>
                                        Optional Items
                                    </h3>
                                    {items.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 relative group"
                                                >
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-100 dark:bg-red-900/30 rounded-full text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <p className="font-medium">{item.name}</p>
                                                    <div className="flex justify-between mt-2 text-sm">
                                                        <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                                            <Scale size={14} /> {item.weight}
                                                        </p>
                                                        <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                                            <DollarSign size={14} /> {item.worth}
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                                                        Ratio: {(item.worth / item.weight).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
                                            <p className="text-zinc-500 dark:text-zinc-400">No items added yet. Add some items to get started!</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setActiveTab("solve")}
                                        disabled={items.length === 0}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${items.length === 0
                                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                                            : "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:opacity-90"
                                            }`}
                                    >
                                        Continue to Solve
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Solve Problem Tab */}
                    <TabsContent value="solve" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Algorithm Selection */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4">Choose Algorithm</h2>
                                <div className="space-y-4">
                                    <div
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${algorithm === "greedy"
                                            ? "border-fuchsia-300 dark:border-fuchsia-700 bg-fuchsia-50 dark:bg-fuchsia-900/20"
                                            : "border-zinc-200 dark:border-zinc-700 hover:border-fuchsia-200 dark:hover:border-fuchsia-800"
                                            }`}
                                        onClick={() => {
                                            setAlgorithm("greedy")
                                            solveGreedy()
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${algorithm === "greedy" ? "bg-fuchsia-500" : "border border-zinc-300 dark:border-zinc-600"}`}></div>
                                            <h3 className="font-medium">Greedy Algorithm</h3>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 ml-7">
                                            Fast but not always optimal. Selects items based on value-to-weight ratio.
                                        </p>
                                    </div>

                                    <div
                                        className={`p-4 rounded-lg border cursor-pointer transition-all ${algorithm === "dp"
                                            ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20"
                                            : "border-zinc-200 dark:border-zinc-700 hover:border-violet-200 dark:hover:border-violet-800"
                                            }`}
                                        onClick={() => {
                                            setAlgorithm("dp")
                                            solveDP()
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${algorithm === "dp" ? "bg-violet-500" : "border border-zinc-300 dark:border-zinc-600"}`}></div>
                                            <h3 className="font-medium">Dynamic Programming</h3>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 ml-7">
                                            Guarantees optimal solution but slower. Considers all possible combinations.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={compareAlgorithms}
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-lg transition-colors py-2 flex items-center justify-center gap-2"
                                    >
                                        <BarChart4 size={16} />
                                        Compare Both Algorithms
                                    </button>
                                </div>
                            </motion.div>

                            {/* Problem Summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Info className="text-fuchsia-500" size={20} />
                                    Problem Summary
                                </h2>

                                <div className="space-y-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Bag Constraints</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Max Weight:</p>
                                                <p className="font-medium">{maxWeight} units</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Empty Bag Weight:</p>
                                                <p className="font-medium">{emptyBagWeight} units</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Items</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Items:</p>
                                                <p className="font-medium">{items.length} items</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Required Items:</p>
                                                <p className="font-medium">{requiredItems.length} items</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <h3 className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Item Statistics</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Weight:</p>
                                                <p className="font-medium">
                                                    {items.reduce((sum, item) => sum + item.weight, 0) +
                                                        requiredItems.reduce((sum, item) => sum + item.weight, 0)} units
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Worth:</p>
                                                <p className="font-medium">
                                                    ${items.reduce((sum, item) => sum + item.worth, 0) +
                                                        requiredItems.reduce((sum, item) => sum + item.worth, 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => setActiveTab("setup")}
                                        className="w-full bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors py-2 flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={16} />
                                        Back to Setup
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>

                    {/* Results Tab */}
                    <TabsContent value="results" className="space-y-6">
                        {/* Bag Visualization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Solution Visualization</h2>
                                {currentSolution && (
                                    <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-sm">
                                        {algorithm === "greedy" ? "Greedy Algorithm" : "Dynamic Programming"}
                                    </div>
                                )}
                            </div>

                            <BagVisualization
                                items={algorithm === "greedy" ? greedySolution?.items || [] : dpSolution?.items || []}
                                maxWeight={maxWeight}
                                currentWeight={currentWeight}
                            />

                            {currentSolution && (
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Items Selected:</p>
                                        <p className="font-medium">{currentSolution.items.length} items</p>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Weight:</p>
                                        <p className="font-medium">{currentSolution.totalWeight} / {maxWeight} units</p>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Worth:</p>
                                        <p className="font-medium">${currentSolution.totalWorth}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Selected Items */}
                        {currentSolution && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4">Selected Items</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {currentSolution.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`p-4 rounded-lg ${item.required
                                                ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-100 dark:border-fuchsia-800/30"
                                                : "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30"
                                                }`}
                                        >
                                            <p className="font-medium">{item.name}</p>
                                            <div className="flex justify-between mt-2 text-sm">
                                                <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                                    <Scale size={14} /> {item.weight}
                                                </p>
                                                <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                                                    <DollarSign size={14} /> {item.worth}
                                                </p>
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                                                Ratio: {(item.worth / item.weight).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {algorithm === "greedy" && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setAlgorithm("dp")
                                                solveDP()
                                            }}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 transition-colors"
                                        >
                                            Try Dynamic Programming
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}

                                {algorithm === "dp" && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setAlgorithm("greedy")
                                                solveGreedy()
                                            }}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 transition-colors"
                                        >
                                            Try Greedy Algorithm
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {algorithm === "dp" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4">Dynamic Programming Visualization</h2>
                                <DPVisualizer items={items} maxWeight={maxWeight} onStepChange={setCurrentStep} />
                            </motion.div>
                        )}

                        {showComparison && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-6">Algorithm Comparison</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 p-6 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800/20">
                                        <h3 className="text-lg font-semibold mb-4 text-fuchsia-600 dark:text-fuchsia-400">Greedy Algorithm</h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Items Selected:</span>
                                                <span className="font-medium">{greedySolution?.items.length || 0} items</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Total Weight:</span>
                                                <span className="font-medium">{greedySolution?.totalWeight || 0} units</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Total Worth:</span>
                                                <span className="font-medium">${greedySolution?.totalWorth || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Execution Time:</span>
                                                <span className="font-medium">{greedySolution?.time.toFixed(2) || 0} ms</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-violet-50 dark:bg-violet-900/10 p-6 rounded-xl border border-violet-100 dark:border-violet-800/20">
                                        <h3 className="text-lg font-semibold mb-4 text-violet-600 dark:text-violet-400">Dynamic Programming</h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Items Selected:</span>
                                                <span className="font-medium">{dpSolution?.items.length || 0} items</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Total Weight:</span>
                                                <span className="font-medium">{dpSolution?.totalWeight || 0} units</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Total Worth:</span>
                                                <span className="font-medium">${dpSolution?.totalWorth || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Execution Time:</span>
                                                <span className="font-medium">{dpSolution?.time.toFixed(2) || 0} ms</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/20">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="text-amber-500 shrink-0 mt-1" size={20} />
                                        <div>
                                            <h3 className="font-medium text-amber-700 dark:text-amber-300 mb-1">Analysis</h3>
                                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                {dpSolution && greedySolution && dpSolution.totalWorth > greedySolution.totalWorth ? (
                                                    <>
                                                        Dynamic Programming found a better solution with ${dpSolution.totalWorth - greedySolution.totalWorth} more worth than the Greedy approach.
                                                        This demonstrates that while Greedy is faster, it doesn't always find the optimal solution.
                                                    </>
                                                ) : dpSolution && greedySolution && dpSolution.totalWorth === greedySolution.totalWorth ? (
                                                    <>
                                                        Both algorithms found solutions with the same total worth. In this case, the Greedy algorithm was more efficient
                                                        as it executed in {greedySolution.time.toFixed(2)} ms compared to {dpSolution.time.toFixed(2)} ms for Dynamic Programming.
                                                    </>
                                                ) : (
                                                    <>
                                                        The Greedy algorithm found a solution quickly, but Dynamic Programming guarantees an optimal solution by considering all possible combinations.
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => setActiveTab("solve")}
                                className="px-6 py-3 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={16} />
                                Back to Algorithm Selection
                            </button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
