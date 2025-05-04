"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    ChevronLeft,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Code,
    Info,
    Lightbulb,
    Layers,
    FileCode,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Dna,
    GitCompare,
    Search,
    SpellCheck,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import Header from "@/components/header"

// Application demos for real-life applications panel
const applications = [
    {
        id: "dna",
        name: "DNA / Protein Sequence Alignment",
        description:
            "In bioinformatics, DNA or protein sequences are aligned to find common evolutionary origins or similar functions. LCS algorithm is a fundamental part of global alignment techniques like Needleman-Wunsch.",
        sampleInputA: "AGTCTGAC",
        sampleInputB: "AGTTGACC",
        tools: "BLAST (Basic Local Alignment Search Tool), Clustal Omega, T-Coffee",
        reference:
            "Needleman, S. B., & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins.",
        link: "https://www.sciencedirect.com/science/article/abs/pii/0022283670900574",
        customDemo: "dna",
        icon: <Dna size={20} />,
    },
    {
        id: "diff",
        name: "Diff Tools / Version Control",
        description:
            "In Git, diff, and code comparison tools, LCS is used to show differences between two files or versions. It helps generate the smallest set of changes needed to transform one file into another.",
        sampleInputA: "function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(5, 3));",
        sampleInputB:
            "function add(a, b) {\n  // Add two numbers\n  return a + b;\n}\n\nlet result = add(5, 3);\nconsole.log(result);",
        tools: "Git diff, GitHub comparison tools, Beyond Compare, Visual Studio Code diff view",
        reference: "Myers, E. W. (1986). An O(ND) difference algorithm and its variations.",
        link: "https://dl.acm.org/doi/10.1145/359424.359432",
        customDemo: "diff",
        icon: <GitCompare size={20} />,
    },
    {
        id: "plagiarism",
        name: "Plagiarism Detection",
        description:
            "LCS helps identify similar patterns of sentences or structures between student submissions or documents, detecting potential plagiarism or content reuse.",
        sampleInputA: "The quick brown fox jumps over the lazy dog. This sentence has all 26 letters.",
        sampleInputB: "The fast brown fox leaps above a lazy dog. This example contains all 26 letters.",
        tools: "Turnitin, Copyscape, PlagScan, JPlag (for code)",
        reference: "Clough, P. et al. (2002). COPS: Detecting plagiarism of text.",
        link: "https://www.researchgate.net/publication/221037057_COPS_Detecting_plagiarism_of_text",
        customDemo: "plagiarism",
        icon: <Search size={20} />,
    },
    {
        id: "spellcheck",
        name: "Spell Checking / Auto-correct",
        description:
            "LCS-based logic is useful in detecting close matches between misspelled words and dictionary entries, helping to suggest corrections.",
        sampleInputA: "dictionary",
        sampleInputB: "dictonary",
        tools: "Hunspell (used in Chrome, Firefox), SymSpell, Microsoft Word spell check",
        reference: "Damerau, F. J. (1964). A technique for computer detection and correction of spelling errors.",
        link: "https://dl.acm.org/doi/10.1145/363958.363994",
        customDemo: "spellcheck",
        icon: <SpellCheck size={20} />,
    },
]

interface Step {
    table: number[][]
    activeCell: [number, number]
    comparing: [number, number]
    isMatch: boolean
    codeLine: number
}

interface Application {
    id: string
    name: string
    description: string
    sampleInputA: string
    sampleInputB: string
    tools: string
    reference: string
    link: string
    customDemo: string
    icon: React.ReactNode
}

// Main component
export default function LCSVisualizer() {
    // State variables with proper types
    const [stringA, setStringA] = useState<string>("ABCDEF")
    const [stringB, setStringB] = useState<string>("AEBDF")
    const [dpTable, setDpTable] = useState<number[][]>([])
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [totalSteps, setTotalSteps] = useState<number>(0)
    const [steps, setSteps] = useState<Step[]>([])
    const [lcs, setLcs] = useState<string>("")
    const [tracebackPath, setTracebackPath] = useState<[number, number][]>([])
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [playbackSpeed, setPlaybackSpeed] = useState<number>(500)
    const [currentExplanation, setCurrentExplanation] = useState<string>("")
    const [isTableFilled, setIsTableFilled] = useState<boolean>(false)
    const [activeCell, setActiveCell] = useState<[number, number] | null>(null)
    const [showRecursiveComparison, setShowRecursiveComparison] = useState<boolean>(false)
    const [currentCodeLine, setCurrentCodeLine] = useState<number>(0)
    const [currentApplication, setCurrentApplication] = useState<Application>(applications[0])
    const [activeTab, setActiveTab] = useState("visualization")
    const playIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

    // Generate all steps for filling the DP table
    const generateSteps = () => {
        const rows = stringA.length + 1
        const cols = stringB.length + 1
        const initialTable: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0))

        const allSteps: Step[] = []
        const explanations: string[] = []

        // Fill the table
        for (let i = 1; i < rows; i++) {
            for (let j = 1; j < cols; j++) {
                const newTable = JSON.parse(
                    JSON.stringify(allSteps.length > 0 ? allSteps[allSteps.length - 1].table : initialTable),
                )

                let explanation = ""
                if (stringA[i - 1] === stringB[j - 1]) {
                    newTable[i][j] = newTable[i - 1][j - 1] + 1
                    explanation = `Characters match: ${stringA[i - 1]} = ${stringB[j - 1]}, so dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${newTable[i - 1][j - 1]} + 1 = ${newTable[i][j]}`
                } else {
                    newTable[i][j] = Math.max(newTable[i - 1][j], newTable[i][j - 1])
                    explanation = `Characters don't match: ${stringA[i - 1]} ≠ ${stringB[j - 1]}, so dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${newTable[i - 1][j]}, ${newTable[i][j - 1]}) = ${newTable[i][j]}`
                }

                allSteps.push({
                    table: newTable,
                    activeCell: [i, j] as [number, number],
                    comparing: [i - 1, j - 1] as [number, number],
                    isMatch: stringA[i - 1] === stringB[j - 1],
                    codeLine: stringA[i - 1] === stringB[j - 1] ? 2 : 4,
                })
                explanations.push(explanation)
            }
        }

        setTotalSteps(allSteps.length)
        setSteps(allSteps)

        return {
            initialTable,
            explanations,
        }
    }

    // Find LCS and traceback path
    const findLCS = (table: number[][]) => {
        const path: [number, number][] = []
        let i = stringA.length
        let j = stringB.length
        let lcsString = ""

        while (i > 0 && j > 0) {
            if (stringA[i - 1] === stringB[j - 1]) {
                lcsString = stringA[i - 1] + lcsString
                path.push([i, j])
                i--
                j--
            } else if (table[i - 1][j] > table[i][j - 1]) {
                path.push([i, j])
                i--
            } else {
                path.push([i, j])
                j--
            }
        }

        setLcs(lcsString)
        setTracebackPath(path)
    }

    // Initialize or reset visualization
    const initializeVisualization = () => {
        setCurrentStep(0)
        setIsTableFilled(false)
        setTracebackPath([])
        setLcs("")
        setActiveCell(null)
        setCurrentCodeLine(0)

        // Generate all steps and set initial state
        const { initialTable, explanations } = generateSteps()
        setDpTable(initialTable)
        setCurrentExplanation(explanations.length > 0 ? explanations[0] : "")

        // Stop any running animation
        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current)
            setIsPlaying(false)
        }
    }

    // Step forward in animation
    const stepForward = () => {
        if (currentStep < totalSteps) {
            const newStep = currentStep + 1
            setCurrentStep(newStep)

            const stepData = steps[newStep - 1] // -1 because steps are 0-indexed
            setDpTable(stepData.table)
            setActiveCell(stepData.activeCell)
            setCurrentCodeLine(stepData.codeLine)

            if (newStep === totalSteps) {
                setIsTableFilled(true)
                findLCS(stepData.table)
            }
        }
    }

    // Step backward in animation
    const stepBackward = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1
            setCurrentStep(newStep)

            if (newStep === 0) {
                // Reset to initial state
                const { initialTable } = generateSteps()
                setDpTable(initialTable)
                setActiveCell(null)
                setCurrentCodeLine(0)
            } else {
                const stepData = steps[newStep - 1]
                setDpTable(stepData.table)
                setActiveCell(stepData.activeCell)
                setCurrentCodeLine(stepData.codeLine)
            }

            setIsTableFilled(false)
            setTracebackPath([])
        }
    }

    // Toggle autoplay
    const toggleAutoPlay = () => {
        if (isPlaying) {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current)
                playIntervalRef.current = undefined
            }
        } else {
            const intervalId = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < totalSteps) {
                        const newStep = prev + 1
                        const stepData = steps[newStep - 1]
                        if (stepData) {
                            setDpTable(stepData.table)
                            setActiveCell(stepData.activeCell)
                            setCurrentCodeLine(stepData.codeLine)

                            if (newStep === totalSteps) {
                                setIsTableFilled(true)
                                findLCS(stepData.table)
                                if (playIntervalRef.current) {
                                    clearInterval(playIntervalRef.current)
                                    playIntervalRef.current = undefined
                                }
                                setIsPlaying(false)
                            }
                        }
                        return newStep
                    } else {
                        if (playIntervalRef.current) {
                            clearInterval(playIntervalRef.current)
                            playIntervalRef.current = undefined
                        }
                        setIsPlaying(false)
                        return prev
                    }
                })
            }, playbackSpeed)
            playIntervalRef.current = intervalId
        }
        setIsPlaying(!isPlaying)
    }

    // Update when input strings change
    useEffect(() => {
        initializeVisualization()
    }, [stringA, stringB])

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current)
            }
        }
    }, [])

    // Update explanation when current step changes
    useEffect(() => {
        if (currentStep > 0 && currentStep <= steps.length) {
            const i = steps[currentStep - 1].activeCell[0]
            const j = steps[currentStep - 1].activeCell[1]

            if (steps[currentStep - 1].isMatch) {
                setCurrentExplanation(
                    `Characters match: ${stringA[i - 1]} = ${stringB[j - 1]}, so dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dpTable[i - 1][j - 1]} + 1 = ${dpTable[i][j]}`,
                )
            } else {
                setCurrentExplanation(
                    `Characters don't match: ${stringA[i - 1]} ≠ ${stringB[j - 1]}, so dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${dpTable[i - 1][j]}, ${dpTable[i][j - 1]}) = ${dpTable[i][j]}`,
                )
            }
        } else {
            setCurrentExplanation("Ready to start filling the DP table")
        }
    }, [currentStep, steps])

    // Code for LCS Algorithm
    const pseudoCode = [
        "function LCS(string A, string B):",
        "    if A[i-1] == B[j-1]:",
        "        dp[i][j] = dp[i-1][j-1] + 1",
        "    else:",
        "        dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "    // After filling table, traceback to find LCS",
    ]

    // Reset visualization with new strings
    const handleVisualize = () => {
        initializeVisualization()
    }

    // Function to handle application selection
    const selectApplication = (app: Application) => {
        setCurrentApplication(app)
        setStringA(app.sampleInputA)
        setStringB(app.sampleInputB)
    }

    // Custom demo components for applications
    const renderCustomDemo = () => {
        switch (currentApplication.customDemo) {
            case "dna":
                return (
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">DNA Alignment Example:</h4>
                        <div className="mb-2">
                            <p className="text-sm">In bioinformatics, scoring models are used:</p>
                            <ul className="list-disc pl-5 text-sm">
                                <li>Match: +1 (conserved bases)</li>
                                <li>Mismatch: -1 (mutation)</li>
                                <li>Gap: -2 (insertion/deletion)</li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-8 gap-1 text-center text-xs font-mono">
                            {currentApplication.sampleInputA.split("").map((base, i) => (
                                <div
                                    key={i}
                                    className={`p-1 rounded ${base === "A"
                                        ? "bg-green-200 dark:bg-green-800"
                                        : base === "G"
                                            ? "bg-red-200 dark:bg-red-800"
                                            : base === "T"
                                                ? "bg-blue-200 dark:bg-blue-800"
                                                : base === "C"
                                                    ? "bg-yellow-200 dark:bg-yellow-800"
                                                    : "bg-zinc-200 dark:bg-zinc-700"
                                        }`}
                                >
                                    {base}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case "diff":
                return (
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Code Diff Example:</h4>
                        <div className="overflow-x-auto text-xs font-mono bg-zinc-800 text-white p-2 rounded">
                            <pre>
                                {currentApplication.sampleInputA.split("\n").map((line, i) => {
                                    const matchLine = currentApplication.sampleInputB.split("\n").find((l) => l === line)
                                    return (
                                        <div key={i} className={matchLine ? "text-green-400" : "text-red-400"}>
                                            {matchLine ? "  " : "- "}
                                            {line}
                                        </div>
                                    )
                                })}
                                {currentApplication.sampleInputB.split("\n").map((line, i) => {
                                    const matchLine = currentApplication.sampleInputA.split("\n").find((l) => l === line)
                                    if (!matchLine) {
                                        return (
                                            <div key={`b-${i}`} className="text-blue-400">
                                                + {line}
                                            </div>
                                        )
                                    }
                                    return null
                                })}
                            </pre>
                        </div>
                    </div>
                )
            case "plagiarism":
                return (
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Plagiarism Detection:</h4>
                        <div className="overflow-x-auto">
                            {currentApplication.sampleInputA.split(" ").map((word, i) => {
                                const isInLCS = currentApplication.sampleInputB.includes(word)
                                return (
                                    <span key={i} className={`${isInLCS ? "bg-yellow-200 dark:bg-yellow-800" : ""} mr-1`}>
                                        {word}
                                    </span>
                                )
                            })}
                        </div>
                        <div className="mt-2">
                            <p className="text-sm font-medium">Similarity score: 67%</p>
                            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mt-1">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                            </div>
                        </div>
                    </div>
                )
            case "spellcheck":
                return (
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Spell Check Example:</h4>
                        <div className="mb-3">
                            <p className="font-medium text-sm">
                                Original word: <span className="text-red-500 underline">dictonary</span>
                            </p>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400">Possible corrections based on LCS score:</p>
                        </div>
                        <ul className="space-y-1">
                            <li className="flex justify-between text-sm">
                                <span>dictionary</span>
                                <span className="font-medium">90% match</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span>directory</span>
                                <span className="font-medium">75% match</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span>pictionary</span>
                                <span className="font-medium">70% match</span>
                            </li>
                        </ul>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 transition-colors duration-300">
            <Header />
            <div className="container mx-auto px-4 max-w-7xl py-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">
                    LCS Visualizer
                </h1>
                <div className="w-24"></div> {/* Spacer for alignment */}

                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700">
                    {/* Input Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 mb-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">String A:</label>
                                <input
                                    type="text"
                                    value={stringA}
                                    onChange={(e) => setStringA(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400"
                                    placeholder="Enter first string"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">String B:</label>
                                <input
                                    type="text"
                                    value={stringB}
                                    onChange={(e) => setStringB(e.target.value)}
                                    className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400"
                                    placeholder="Enter second string"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="visualization" className="flex items-center gap-2">
                                <Layers size={16} />
                                <span className="hidden sm:inline">Visualization</span>
                                <span className="sm:hidden">Viz</span>
                            </TabsTrigger>
                            <TabsTrigger value="algorithm" className="flex items-center gap-2">
                                <Code size={16} />
                                <span className="hidden sm:inline">Algorithm</span>
                                <span className="sm:hidden">Algo</span>
                            </TabsTrigger>
                            <TabsTrigger value="applications" className="flex items-center gap-2">
                                <FileCode size={16} />
                                <span className="hidden sm:inline">Applications</span>
                                <span className="sm:hidden">Apps</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Visualization Tab */}
                        <TabsContent value="visualization" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* DP Table Visualization */}
                                <div className="lg:col-span-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                                    >
                                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                            <Layers className="text-fuchsia-500" size={20} />
                                            DP Table Visualization
                                        </h2>

                                        {/* Progress Indicator */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                                <span>
                                                    Progress: {currentStep} / {totalSteps}
                                                </span>
                                                <span>{Math.round((currentStep / totalSteps) * 100) || 0}%</span>
                                            </div>
                                            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${(currentStep / totalSteps) * 100 || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* DP Table */}
                                        <div className="overflow-x-auto mb-6">
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-zinc-300 dark:border-zinc-700 p-2 bg-zinc-100 dark:bg-zinc-900"></th>
                                                        <th className="border border-zinc-300 dark:border-zinc-700 p-2 bg-zinc-100 dark:bg-zinc-900"></th>
                                                        {stringB.split("").map((char, idx) => (
                                                            <th
                                                                key={idx}
                                                                className="border border-zinc-300 dark:border-zinc-700 p-2 bg-zinc-100 dark:bg-zinc-900 font-medium"
                                                            >
                                                                {char}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dpTable.map((row, i) => (
                                                        <tr key={i}>
                                                            <td
                                                                className={`border border-zinc-300 dark:border-zinc-700 p-2 ${i === 0 ? "bg-zinc-100 dark:bg-zinc-900" : ""}`}
                                                            >
                                                                {i === 0 ? "" : stringA[i - 1]}
                                                            </td>
                                                            {row.map((cell, j) => {
                                                                const isActive = activeCell && activeCell[0] === i && activeCell[1] === j
                                                                const isComparison =
                                                                    steps[currentStep - 1]?.comparing &&
                                                                    ((steps[currentStep - 1].comparing[0] === i &&
                                                                        steps[currentStep - 1].comparing[1] === j) ||
                                                                        (activeCell &&
                                                                            ((i === activeCell[0] - 1 && j === activeCell[1]) ||
                                                                                (i === activeCell[0] && j === activeCell[1] - 1))))
                                                                const isMatch = isActive && steps[currentStep - 1]?.isMatch
                                                                const isTraceback = tracebackPath.some(([x, y]) => x === i && y === j)

                                                                let cellClass =
                                                                    "border border-zinc-300 dark:border-zinc-700 p-2 text-center transition-all duration-300 "

                                                                if (isActive) {
                                                                    cellClass += "bg-yellow-200 dark:bg-yellow-800 font-bold "
                                                                } else if (isComparison) {
                                                                    cellClass += "bg-blue-100 dark:bg-blue-900/30 "
                                                                } else if (isMatch) {
                                                                    cellClass += "bg-green-200 dark:bg-green-800 "
                                                                } else if (isTraceback) {
                                                                    cellClass += "bg-fuchsia-200 dark:bg-fuchsia-900/30 "
                                                                }

                                                                return (
                                                                    <td key={j} className={cellClass}>
                                                                        {cell}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={stepBackward}
                                                    disabled={currentStep === 0}
                                                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                                                >
                                                    <SkipBack size={18} />
                                                </button>
                                                <button
                                                    onClick={toggleAutoPlay}
                                                    className={`p-2 rounded-lg flex items-center justify-center ${isPlaying ? "bg-red-500 text-white" : "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white"}`}
                                                >
                                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                                </button>
                                                <button
                                                    onClick={stepForward}
                                                    disabled={currentStep === totalSteps}
                                                    className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                                                >
                                                    <SkipForward size={18} />
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-zinc-600 dark:text-zinc-400">Speed:</span>
                                                <div className="w-32">
                                                    <Slider
                                                        value={[playbackSpeed]}
                                                        min={100}
                                                        max={2000}
                                                        step={100}
                                                        onValueChange={(value) => setPlaybackSpeed(value[0])}
                                                    />
                                                </div>
                                                <span className="text-sm text-zinc-600 dark:text-zinc-400 w-16">{playbackSpeed}ms</span>
                                            </div>
                                        </div>

                                        {/* Current Explanation */}
                                        <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                            <div className="flex items-start gap-2">
                                                <Info className="text-fuchsia-500 mt-0.5" size={18} />
                                                <div>
                                                    <h3 className="font-medium mb-1">Current Step Explanation:</h3>
                                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{currentExplanation}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* LCS Result */}
                                        {isTableFilled && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/30">
                                                <h3 className="font-medium mb-2 text-fuchsia-700 dark:text-fuchsia-300">
                                                    Longest Common Subsequence:
                                                </h3>
                                                <div className="text-lg font-mono bg-white dark:bg-zinc-800 p-3 rounded-md border border-fuchsia-200 dark:border-fuchsia-800/30">
                                                    {lcs.split("").map((char, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block px-1 mx-0.5 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded"
                                                        >
                                                            {char}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">Length: {lcs.length}</div>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Legend and Info */}
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Legend */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                                    >
                                        <h3 className="font-medium mb-4">Legend:</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 mr-2 rounded"></div>
                                                <span className="text-sm">Current cell</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 mr-2 rounded"></div>
                                                <span className="text-sm">Comparing cells</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-green-200 dark:bg-green-800 mr-2 rounded"></div>
                                                <span className="text-sm">Character match</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-fuchsia-200 dark:bg-fuchsia-900/30 mr-2 rounded"></div>
                                                <span className="text-sm">Traceback path</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Pseudo Code */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                                    >
                                        <h3 className="font-medium mb-4 flex items-center gap-2">
                                            <Code className="text-fuchsia-500" size={18} />
                                            Pseudo Code:
                                        </h3>
                                        <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm">
                                            {pseudoCode.map((line, idx) => (
                                                <div key={idx} className={`${currentCodeLine === idx ? "bg-fuchsia-500/30 -mx-4 px-4" : ""}`}>
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Algorithm Overview */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                        className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                                                <Info className="text-amber-500" size={18} />
                                            </div>
                                            <div>
                                                <h3 className="font-medium mb-2">Algorithm Overview</h3>
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                    The Longest Common Subsequence (LCS) problem finds the longest subsequence common to two
                                                    sequences. Unlike substrings, subsequences don't need to be consecutive elements.
                                                </p>
                                                <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                                                    For example, the LCS of "ABCDEF" and "AEBDF" is "ABDF" with length 4.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Algorithm Tab */}
                        <TabsContent value="algorithm" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Algorithm Details */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                                >
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Code className="text-fuchsia-500" size={20} />
                                        LCS Algorithm
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium mb-2">Problem Definition:</h3>
                                            <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                                                Given two sequences, find the length of the longest subsequence present in both of them. A
                                                subsequence is a sequence that appears in the same relative order, but not necessarily
                                                contiguous.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-medium mb-2">Complexity Analysis:</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                                                <li>
                                                    Time Complexity:{" "}
                                                    <span className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1 rounded">O(m × n)</span>
                                                </li>
                                                <li>
                                                    Space Complexity:{" "}
                                                    <span className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1 rounded">O(m × n)</span>
                                                </li>
                                                <li>Where m = length of String A, n = length of String B</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-medium mb-2">Algorithm Steps:</h3>
                                            <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                                                <li>Create a table of size (m+1) × (n+1) where m and n are lengths of the two sequences.</li>
                                                <li>Initialize the first row and column with zeros.</li>
                                                <li>
                                                    For each character in sequence A and B:
                                                    <ul className="list-disc pl-5 mt-1">
                                                        <li>If characters match, dp[i][j] = dp[i-1][j-1] + 1</li>
                                                        <li>If characters don't match, dp[i][j] = max(dp[i-1][j], dp[i][j-1])</li>
                                                    </ul>
                                                </li>
                                                <li>The value in dp[m][n] gives the length of LCS.</li>
                                                <li>To find the actual LCS, trace back from dp[m][n] to dp[0][0].</li>
                                            </ol>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Recursive vs DP Approach */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            <Layers className="text-fuchsia-500" size={20} />
                                            Recursive vs. DP Approach
                                        </h2>
                                        <button
                                            onClick={() => setShowRecursiveComparison(!showRecursiveComparison)}
                                            className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            {showRecursiveComparison ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium mb-2">Recursive Approach:</h3>
                                            <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                                <pre>{`function LCS_recursive(A, i, B, j):
  if i == 0 or j == 0:
    return 0
  if A[i-1] == B[j-1]:
    return 1 + LCS_recursive(A, i-1, B, j-1)
  else:
    return max(LCS_recursive(A, i-1, B, j), 
              LCS_recursive(A, i, B, j-1))`}</pre>
                                            </div>
                                        </div>

                                        {showRecursiveComparison && (
                                            <>
                                                <div>
                                                    <h3 className="font-medium mb-2">Overlapping Subproblems:</h3>
                                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                        The recursive approach has exponential time complexity O(2^(m+n)) due to repeated
                                                        calculations of the same subproblems. Dynamic programming solves each subproblem once and
                                                        stores the results in a table, reducing complexity to O(m × n).
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="font-medium mb-2">Recursive Call Tree:</h3>
                                                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                                        <div className="text-center">
                                                            <div className="inline-block p-2 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg mb-2">
                                                                LCS("ABC", "AC")
                                                            </div>
                                                            <div className="flex justify-center gap-8">
                                                                <div className="flex flex-col items-center">
                                                                    <div className="h-6 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2">
                                                                        LCS("AB", "AC")
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <div className="flex flex-col items-center">
                                                                            <div className="h-6 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                                                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                                LCS("A", "AC")
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-center">
                                                                            <div className="h-6 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                                                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                                LCS("AB", "A")
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-center">
                                                                    <div className="h-6 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-2">
                                                                        LCS("ABC", "A")
                                                                    </div>
                                                                    <div className="flex gap-4">
                                                                        <div className="flex flex-col items-center">
                                                                            <div className="h-6 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                                                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                                LCS("AB", "A")
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-center">
                                                                            <div className="h-6 w-px bg-zinc-400 dark:bg-zinc-600"></div>
                                                                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                                                LCS("ABC", "")
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-center mt-4 text-zinc-500 dark:text-zinc-400">
                                                            Notice how LCS("AB", "A") appears multiple times in the recursive tree (highlighted in
                                                            green)
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <h3 className="font-medium mb-2">Dynamic Programming Approach:</h3>
                                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                The DP approach uses a table to store results of subproblems, avoiding redundant calculations.
                                                Each cell dp[i][j] represents the length of LCS of A[0...i-1] and B[0...j-1].
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/30">
                                            <h3 className="font-medium mb-2 text-fuchsia-700 dark:text-fuchsia-300">Key Insight:</h3>
                                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                                The LCS problem exhibits both optimal substructure and overlapping subproblems, making it a
                                                perfect candidate for dynamic programming. The DP approach reduces time complexity from
                                                exponential to polynomial.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Implementation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <FileCode className="text-fuchsia-500" size={20} />
                                    Implementation
                                </h2>

                                <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                    <pre>{`function longestCommonSubsequence(text1: string, text2: string): number {
    const m = text1.length;
    const n = text2.length;
    
    // Create DP table
    const dp: number[][] = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(0));
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // The value in dp[m][n] is the length of LCS
    return dp[m][n];
}`}</pre>
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">To find the actual LCS string:</h3>
                                    <div className="bg-zinc-900 text-zinc-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                        <pre>{`function findLCS(text1: string, text2: string): string {
    const m = text1.length;
    const n = text2.length;
    const dp: number[][] = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(0));
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Traceback to find the LCS
    let i = m, j = n;
    let lcs = "";
    
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs = text1[i - 1] + lcs;
            i--; j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}`}</pre>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Applications Tab */}
                        <TabsContent value="applications" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {applications.map((app) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.05 * applications.indexOf(app) }}
                                        className={`p-4 rounded-xl transition-colors cursor-pointer ${currentApplication.id === app.id
                                            ? "bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 border-2 border-fuchsia-300 dark:border-fuchsia-700"
                                            : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-fuchsia-200 dark:hover:border-fuchsia-800"
                                            }`}
                                        onClick={() => setCurrentApplication(app)}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div
                                                className={`p-2 rounded-full ${currentApplication.id === app.id
                                                    ? "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-500"
                                                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                                                    }`}
                                            >
                                                {app.icon}
                                            </div>
                                            <h3
                                                className={`font-medium ${currentApplication.id === app.id
                                                    ? "text-fuchsia-700 dark:text-fuchsia-300"
                                                    : "text-zinc-700 dark:text-zinc-300"
                                                    }`}
                                            >
                                                {app.name}
                                            </h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <div className="p-2 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-500">
                                            {currentApplication.icon}
                                        </div>
                                        {currentApplication.name}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setStringA(currentApplication.sampleInputA)
                                            setStringB(currentApplication.sampleInputB)
                                            setActiveTab("visualization")
                                            handleVisualize()
                                        }}
                                        className="px-3 py-1.5 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-colors text-sm flex items-center gap-1"
                                    >
                                        <Play size={14} />
                                        Use This Example
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Context:</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{currentApplication.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Application Demo:</h3>
                                        {renderCustomDemo()}
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Real-World Tools:</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{currentApplication.tools}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Further Reading:</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{currentApplication.reference}</p>
                                        <a
                                            href={currentApplication.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-fuchsia-600 dark:text-fuchsia-400 hover:underline text-sm flex items-center gap-1 mt-1"
                                        >
                                            View reference paper/documentation
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className="bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 rounded-xl p-6 border border-fuchsia-200 dark:border-fuchsia-800/30"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="bg-white dark:bg-zinc-800 p-2 rounded-full">
                                        <Lightbulb className="text-amber-500" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2 text-fuchsia-700 dark:text-fuchsia-300">Why LCS is Important</h3>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                            The Longest Common Subsequence algorithm is a fundamental technique in computer science with
                                            applications spanning from bioinformatics to version control systems. Its ability to find patterns
                                            across sequences makes it invaluable for comparing data, detecting similarities, and analyzing
                                            differences.
                                        </p>
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                                            LCS is also a classic example of dynamic programming, demonstrating how complex problems can be
                                            broken down into overlapping subproblems to achieve efficient solutions.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>
                    </Tabs>

                    {/* Legend for Mobile */}
                    <div className="mt-6 bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 lg:hidden">
                        <h3 className="font-medium mb-2">Legend:</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 mr-2 rounded"></div>
                                <span className="text-sm">Current cell</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 mr-2 rounded"></div>
                                <span className="text-sm">Comparing cells</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-200 dark:bg-green-800 mr-2 rounded"></div>
                                <span className="text-sm">Character match</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-fuchsia-200 dark:bg-fuchsia-900/30 mr-2 rounded"></div>
                                <span className="text-sm">Traceback path</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
