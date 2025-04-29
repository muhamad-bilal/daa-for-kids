"use client";

import { useState, useEffect, useRef } from 'react';

// Application demos for real-life applications panel
const applications = [
    {
        id: "dna",
        name: "DNA / Protein Sequence Alignment",
        description: "In bioinformatics, DNA or protein sequences are aligned to find common evolutionary origins or similar functions. LCS algorithm is a fundamental part of global alignment techniques like Needleman-Wunsch.",
        sampleInputA: "AGTCTGAC",
        sampleInputB: "AGTTGACC",
        tools: "BLAST (Basic Local Alignment Search Tool), Clustal Omega, T-Coffee",
        reference: "Needleman, S. B., & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins.",
        link: "https://www.sciencedirect.com/science/article/abs/pii/0022283670900574",
        customDemo: "dna"
    },
    {
        id: "diff",
        name: "Diff Tools / Version Control",
        description: "In Git, diff, and code comparison tools, LCS is used to show differences between two files or versions. It helps generate the smallest set of changes needed to transform one file into another.",
        sampleInputA: "function add(a, b) {\n  return a + b;\n}\n\nconsole.log(add(5, 3));",
        sampleInputB: "function add(a, b) {\n  // Add two numbers\n  return a + b;\n}\n\nlet result = add(5, 3);\nconsole.log(result);",
        tools: "Git diff, GitHub comparison tools, Beyond Compare, Visual Studio Code diff view",
        reference: "Myers, E. W. (1986). An O(ND) difference algorithm and its variations.",
        link: "https://dl.acm.org/doi/10.1145/359424.359432",
        customDemo: "diff"
    },
    {
        id: "plagiarism",
        name: "Plagiarism Detection",
        description: "LCS helps identify similar patterns of sentences or structures between student submissions or documents, detecting potential plagiarism or content reuse.",
        sampleInputA: "The quick brown fox jumps over the lazy dog. This sentence has all 26 letters.",
        sampleInputB: "The fast brown fox leaps above a lazy dog. This example contains all 26 letters.",
        tools: "Turnitin, Copyscape, PlagScan, JPlag (for code)",
        reference: "Clough, P. et al. (2002). COPS: Detecting plagiarism of text.",
        link: "https://www.researchgate.net/publication/221037057_COPS_Detecting_plagiarism_of_text",
        customDemo: "plagiarism"
    },
    {
        id: "spellcheck",
        name: "Spell Checking / Auto-correct",
        description: "LCS-based logic is useful in detecting close matches between misspelled words and dictionary entries, helping to suggest corrections.",
        sampleInputA: "dictionary",
        sampleInputB: "dictonary",
        tools: "Hunspell (used in Chrome, Firefox), SymSpell, Microsoft Word spell check",
        reference: "Damerau, F. J. (1964). A technique for computer detection and correction of spelling errors.",
        link: "https://dl.acm.org/doi/10.1145/363958.363994",
        customDemo: "spellcheck"
    }
];

// Main component
export default function LCSVisualizer() {
    // State variables
    const [stringA, setStringA] = useState("ABCDEF");
    const [stringB, setStringB] = useState("AEBDF");
    const [dpTable, setDpTable] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [steps, setSteps] = useState([]);
    const [lcs, setLcs] = useState("");
    const [tracebackPath, setTracebackPath] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(500); // ms
    const [currentExplanation, setCurrentExplanation] = useState("");
    const [isTableFilled, setIsTableFilled] = useState(false);
    const [activeCell, setActiveCell] = useState(null);
    const [showRecursiveComparison, setShowRecursiveComparison] = useState(false);
    const [currentCodeLine, setCurrentCodeLine] = useState(0);
    const [showApplications, setShowApplications] = useState(false);
    const [currentApplication, setCurrentApplication] = useState(applications[0]);
    const playIntervalRef = useRef(null);

    // Generate all steps for filling the DP table
    const generateSteps = () => {
        const rows = stringA.length + 1;
        const cols = stringB.length + 1;
        const initialTable = Array(rows).fill().map(() => Array(cols).fill(0));

        const allSteps = [];
        const explanations = [];

        // Base case steps (filling first row and column with 0s)
        // These are already filled in the initial table

        // Fill the table
        for (let i = 1; i < rows; i++) {
            for (let j = 1; j < cols; j++) {
                const newTable = JSON.parse(JSON.stringify(allSteps.length > 0 ? allSteps[allSteps.length - 1].table : initialTable));

                let explanation = "";
                if (stringA[i - 1] === stringB[j - 1]) {
                    newTable[i][j] = newTable[i - 1][j - 1] + 1;
                    explanation = `Characters match: ${stringA[i - 1]} = ${stringB[j - 1]}, so dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${newTable[i - 1][j - 1]} + 1 = ${newTable[i][j]}`;
                } else {
                    newTable[i][j] = Math.max(newTable[i - 1][j], newTable[i][j - 1]);
                    explanation = `Characters don't match: ${stringA[i - 1]} ≠ ${stringB[j - 1]}, so dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${newTable[i - 1][j]}, ${newTable[i][j - 1]}) = ${newTable[i][j]}`;
                }

                allSteps.push({
                    table: newTable,
                    activeCell: [i, j],
                    comparing: [i - 1, j - 1],
                    isMatch: stringA[i - 1] === stringB[j - 1],
                    codeLine: stringA[i - 1] === stringB[j - 1] ? 2 : 4
                });
                explanations.push(explanation);
            }
        }

        // Set total steps and all steps
        setTotalSteps(allSteps.length);
        setSteps(allSteps);

        // Return first table and first explanation
        return {
            initialTable,
            explanations
        };
    };

    // Find LCS and traceback path
    const findLCS = (table) => {
        const path = [];
        let i = stringA.length;
        let j = stringB.length;
        let lcsString = "";

        while (i > 0 && j > 0) {
            if (stringA[i - 1] === stringB[j - 1]) {
                lcsString = stringA[i - 1] + lcsString;
                path.push([i, j]);
                i--; j--;
            } else if (table[i - 1][j] > table[i][j - 1]) {
                path.push([i, j]);
                i--;
            } else {
                path.push([i, j]);
                j--;
            }
        }

        setLcs(lcsString);
        setTracebackPath(path);
    };

    // Initialize or reset visualization
    const initializeVisualization = () => {
        setCurrentStep(0);
        setIsTableFilled(false);
        setTracebackPath([]);
        setLcs("");
        setActiveCell(null);
        setCurrentCodeLine(0);

        // Generate all steps and set initial state
        const { initialTable, explanations } = generateSteps();
        setDpTable(initialTable);
        setCurrentExplanation(explanations.length > 0 ? explanations[0] : "");

        // Stop any running animation
        if (playIntervalRef.current) {
            clearInterval(playIntervalRef.current);
            setIsPlaying(false);
        }
    };

    // Step forward in animation
    const stepForward = () => {
        if (currentStep < totalSteps) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);

            const stepData = steps[newStep - 1]; // -1 because steps are 0-indexed
            setDpTable(stepData.table);
            setActiveCell(stepData.activeCell);
            setCurrentCodeLine(stepData.codeLine);

            if (newStep === totalSteps) {
                setIsTableFilled(true);
                findLCS(stepData.table);
            }
        }
    };

    // Step backward in animation
    const stepBackward = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);

            if (newStep === 0) {
                // Reset to initial state
                const { initialTable } = generateSteps();
                setDpTable(initialTable);
                setActiveCell(null);
                setCurrentCodeLine(0);
            } else {
                const stepData = steps[newStep - 1];
                setDpTable(stepData.table);
                setActiveCell(stepData.activeCell);
                setCurrentCodeLine(stepData.codeLine);
            }

            setIsTableFilled(false);
            setTracebackPath([]);
        }
    };

    // Toggle autoplay
    const toggleAutoPlay = () => {
        if (isPlaying) {
            clearInterval(playIntervalRef.current);
        } else {
            playIntervalRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < totalSteps) {
                        const newStep = prev + 1;
                        const stepData = steps[newStep - 1];
                        setDpTable(stepData.table);
                        setActiveCell(stepData.activeCell);
                        setCurrentCodeLine(stepData.codeLine);

                        if (newStep === totalSteps) {
                            setIsTableFilled(true);
                            findLCS(stepData.table);
                            clearInterval(playIntervalRef.current);
                            setIsPlaying(false);
                        }
                        return newStep;
                    } else {
                        clearInterval(playIntervalRef.current);
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, playbackSpeed);
        }
        setIsPlaying(!isPlaying);
    };

    // Update when input strings change
    useEffect(() => {
        initializeVisualization();
    }, [stringA, stringB]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current);
            }
        };
    }, []);

    // Update explanation when current step changes
    useEffect(() => {
        if (currentStep > 0 && currentStep <= steps.length) {
            const i = steps[currentStep - 1].activeCell[0];
            const j = steps[currentStep - 1].activeCell[1];

            if (steps[currentStep - 1].isMatch) {
                setCurrentExplanation(`Characters match: ${stringA[i - 1]} = ${stringB[j - 1]}, so dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dpTable[i - 1][j - 1]} + 1 = ${dpTable[i][j]}`);
            } else {
                setCurrentExplanation(`Characters don't match: ${stringA[i - 1]} ≠ ${stringB[j - 1]}, so dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${dpTable[i - 1][j]}, ${dpTable[i][j - 1]}) = ${dpTable[i][j]}`);
            }
        } else {
            setCurrentExplanation("Ready to start filling the DP table");
        }
    }, [currentStep, steps]);

    // Code for LCS Algorithm
    const pseudoCode = [
        "function LCS(string A, string B):",
        "    if A[i-1] == B[j-1]:",
        "        dp[i][j] = dp[i-1][j-1] + 1",
        "    else:",
        "        dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "    // After filling table, traceback to find LCS"
    ];

    // Reset visualization with new strings
    const handleVisualize = () => {
        initializeVisualization();
    };

    // Render the UI
    // Function to handle application selection
    const selectApplication = (app) => {
        setCurrentApplication(app);
        setStringA(app.sampleInputA);
        setStringB(app.sampleInputB);
    };

    // Custom demo components for applications
    const renderCustomDemo = () => {
        switch (currentApplication.customDemo) {
            case "dna":
                return (
                    <div className="bg-gray-100 p-3 rounded-md">
                        <h4 className="font-medium mb-2">DNA Alignment Example:</h4>
                        <div className="mb-2">
                            <p className="text-sm">In bioinformatics, scoring models are used:</p>
                            <ul className="list-disc pl-5 text-sm">
                                <li>Match: +1 (conserved bases)</li>
                                <li>Mismatch: -1 (mutation)</li>
                                <li>Gap: -2 (insertion/deletion)</li>
                            </ul>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-center text-xs font-mono">
                            {currentApplication.sampleInputA.split('').map((base, i) => (
                                <div key={i} className={`p-1 rounded ${base === 'A' ? 'bg-green-200' :
                                    base === 'G' ? 'bg-red-200' :
                                        base === 'T' ? 'bg-blue-200' :
                                            base === 'C' ? 'bg-yellow-200' : 'bg-gray-200'
                                    }`}>
                                    {base}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "diff":
                return (
                    <div className="bg-gray-100 p-3 rounded-md">
                        <h4 className="font-medium mb-2">Code Diff Example:</h4>
                        <div className="overflow-x-auto text-xs font-mono bg-gray-800 text-white p-2 rounded">
                            <pre>
                                {currentApplication.sampleInputA.split('\n').map((line, i) => {
                                    const matchLine = currentApplication.sampleInputB.split('\n').find(l => l === line);
                                    return (
                                        <div key={i} className={matchLine ? 'text-green-400' : 'text-red-400'}>
                                            {matchLine ? '  ' : '- '}{line}
                                        </div>
                                    );
                                })}
                                {currentApplication.sampleInputB.split('\n').map((line, i) => {
                                    const matchLine = currentApplication.sampleInputA.split('\n').find(l => l === line);
                                    if (!matchLine) {
                                        return (
                                            <div key={`b-${i}`} className="text-blue-400">
                                                + {line}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </pre>
                        </div>
                    </div>
                );
            case "plagiarism":
                return (
                    <div className="bg-gray-100 p-3 rounded-md">
                        <h4 className="font-medium mb-2">Plagiarism Detection:</h4>
                        <div className="overflow-x-auto">
                            {currentApplication.sampleInputA.split(' ').map((word, i) => {
                                const isInLCS = currentApplication.sampleInputB.includes(word);
                                return (
                                    <span key={i} className={`${isInLCS ? 'bg-yellow-200' : ''} mr-1`}>
                                        {word}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="mt-2">
                            <p className="text-sm font-medium">Similarity score: 67%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                            </div>
                        </div>
                    </div>
                );
            case "spellcheck":
                return (
                    <div className="bg-gray-100 p-3 rounded-md">
                        <h4 className="font-medium mb-2">Spell Check Example:</h4>
                        <div className="mb-3">
                            <p className="font-medium text-sm">Original word: <span className="text-red-500 underline">dictonary</span></p>
                            <p className="text-xs text-gray-600">Possible corrections based on LCS score:</p>
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
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 p-4">
            {/* Header */}
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold text-blue-700">LCS Visualizer</h1>
                <p className="text-lg text-gray-600">Longest Common Subsequence - Interactive DP Table Explorer</p>
                <button
                    onClick={() => setShowApplications(true)}
                    className="mt-2 text-blue-600 underline hover:text-blue-800"
                >
                    View Real-Life Applications
                </button>
            </header>

            {/* Input Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">String A:</label>
                        <input
                            type="text"
                            value={stringA}
                            onChange={(e) => setStringA(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first string"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">String B:</label>
                        <input
                            type="text"
                            value={stringB}
                            onChange={(e) => setStringB(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter second string"
                        />
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleVisualize}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Visualize
                    </button>
                    <div className="relative inline-block text-left">
                        <select
                            className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            onChange={(e) => {
                                const app = applications.find(a => a.id === e.target.value);
                                if (app) selectApplication(app);
                            }}
                            value={currentApplication.id}
                        >
                            <option value="" disabled>Load example from application</option>
                            {applications.map(app => (
                                <option key={app.id} value={app.id}>{app.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Visualization Area */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: DP Table & Controls */}
                <div className="bg-white p-6 rounded-lg shadow-md flex-1">
                    <h2 className="text-xl font-semibold mb-4">DP Table Visualization</h2>

                    {/* Progress Indicator */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress: {currentStep} / {totalSteps}</span>
                            <span>{Math.round((currentStep / totalSteps) * 100) || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100 || 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* DP Table */}
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 bg-gray-100"></th>
                                    <th className="border border-gray-300 p-2 bg-gray-100"></th>
                                    {stringB.split('').map((char, idx) => (
                                        <th key={idx} className="border border-gray-300 p-2 bg-gray-100 font-medium">
                                            {char}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {dpTable.map((row, i) => (
                                    <tr key={i}>
                                        <td className={`border border-gray-300 p-2 ${i === 0 ? 'bg-gray-100' : ''}`}>
                                            {i === 0 ? '' : stringA[i - 1]}
                                        </td>
                                        {row.map((cell, j) => {
                                            const isActive = activeCell && activeCell[0] === i && activeCell[1] === j;
                                            const isComparison = steps[currentStep - 1]?.comparing &&
                                                ((steps[currentStep - 1].comparing[0] === i && steps[currentStep - 1].comparing[1] === j) ||
                                                    (activeCell && ((i === activeCell[0] - 1 && j === activeCell[1]) ||
                                                        (i === activeCell[0] && j === activeCell[1] - 1))));
                                            const isMatch = isActive && steps[currentStep - 1]?.isMatch;
                                            const isTraceback = tracebackPath.some(([x, y]) => x === i && y === j);

                                            let cellClass = "border border-gray-300 p-2 text-center transition-all duration-300 ";

                                            if (isActive) {
                                                cellClass += "bg-yellow-200 font-bold ";
                                            } else if (isComparison) {
                                                cellClass += "bg-blue-100 ";
                                            } else if (isMatch) {
                                                cellClass += "bg-green-200 ";
                                            } else if (isTraceback) {
                                                cellClass += "bg-purple-200 ";
                                            }

                                            return (
                                                <td key={j} className={cellClass}>
                                                    {cell}
                                                </td>
                                            );
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
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={toggleAutoPlay}
                                className={`px-3 py-1 rounded ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                            >
                                {isPlaying ? 'Pause' : 'Auto Play'}
                            </button>
                            <button
                                onClick={stepForward}
                                disabled={currentStep === totalSteps}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Forward →
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Speed:</span>
                            <input
                                type="range"
                                min="100"
                                max="2000"
                                step="100"
                                value={playbackSpeed}
                                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                                className="w-32"
                            />
                            <span className="text-sm">{playbackSpeed}ms</span>
                        </div>
                    </div>

                    {/* Current Explanation */}
                    <div className="bg-gray-100 p-3 rounded-md">
                        <h3 className="font-medium mb-1">Current Step Explanation:</h3>
                        <p>{currentExplanation}</p>
                    </div>

                    {/* LCS Result */}
                    {isTableFilled && (
                        <div className="mt-4 p-3 bg-green-100 rounded-md">
                            <h3 className="font-medium mb-1">Longest Common Subsequence:</h3>
                            <div className="text-lg font-mono">{lcs}</div>
                            <div className="text-sm text-gray-600 mt-1">Length: {lcs.length}</div>
                        </div>
                    )}
                </div>

                {/* Right Column: Code and Complexity */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-96">
                    <h2 className="text-xl font-semibold mb-4">LCS Algorithm</h2>

                    {/* Pseudo Code */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Pseudo Code:</h3>
                        <div className="bg-gray-800 text-white p-3 rounded-md font-mono text-sm">
                            {pseudoCode.map((line, idx) => (
                                <div key={idx} className={`${currentCodeLine === idx ? 'bg-blue-700 -mx-3 px-3' : ''}`}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Complexity Analysis */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Complexity Analysis:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Time Complexity: <span className="font-mono">O(m × n)</span></li>
                            <li>Space Complexity: <span className="font-mono">O(m × n)</span></li>
                            <li>Where m = length of String A, n = length of String B</li>
                        </ul>
                    </div>

                    {/* Toggle Recursive Comparison */}
                    <div>
                        <button
                            onClick={() => setShowRecursiveComparison(!showRecursiveComparison)}
                            className="w-full px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            {showRecursiveComparison ? 'Hide' : 'Show'} Recursive Comparison
                        </button>

                        {showRecursiveComparison && (
                            <div className="mt-4 bg-gray-100 p-3 rounded-md">
                                <h3 className="font-medium mb-2">Recursive vs. DP Approach:</h3>
                                <p className="mb-2">Recursive approach (without memoization):</p>
                                <pre className="bg-gray-800 text-white p-2 rounded-md text-xs overflow-x-auto">
                                    {`function LCS_recursive(A, i, B, j):
  if i == 0 or j == 0:
    return 0
  if A[i-1] == B[j-1]:
    return 1 + LCS_recursive(A, i-1, B, j-1)
  else:
    return max(LCS_recursive(A, i-1, B, j), 
              LCS_recursive(A, i, B, j-1))`}
                                </pre>
                                <p className="mt-2 text-sm">
                                    The recursive approach has exponential time complexity O(2^(m+n)) due to repeated calculations
                                    of the same subproblems. Dynamic programming solves each subproblem once and stores the results
                                    in a table, reducing complexity to O(m × n).
                                </p>
                                <div className="mt-4">
                                    <h4 className="font-medium">Example of Overlapping Subproblems:</h4>
                                    <div className="bg-white p-2 rounded-md mt-1">
                                        <img src="/api/placeholder/500/200" alt="Recursive call tree showing overlapping subproblems" className="w-full" />
                                        <p className="text-xs text-center mt-1">Visualization of overlapping subproblems in recursive approach</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-medium mb-2">Legend:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-200 mr-2"></div>
                        <span>Current cell</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-100 mr-2"></div>
                        <span>Comparing cells</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-200 mr-2"></div>
                        <span>Character match</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-200 mr-2"></div>
                        <span>Traceback path</span>
                    </div>
                </div>
            </div>

            {/* Real-Life Applications Modal */}
            {showApplications && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
                        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                            <h2 className="text-2xl font-bold text-gray-800">Real-Life Applications of LCS</h2>
                            <button
                                onClick={() => setShowApplications(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                {applications.map(app => (
                                    <button
                                        key={app.id}
                                        className={`p-3 rounded-md transition-colors ${currentApplication.id === app.id
                                            ? 'bg-blue-100 border-2 border-blue-500'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        onClick={() => setCurrentApplication(app)}
                                    >
                                        <h3 className="font-medium text-blue-700">{app.name}</h3>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-blue-700 mb-2">{currentApplication.name}</h3>

                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-1">Context:</h4>
                                    <p className="text-gray-600">{currentApplication.description}</p>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-1">Application Demo:</h4>
                                    {renderCustomDemo()}

                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setStringA(currentApplication.sampleInputA);
                                                setStringB(currentApplication.sampleInputB);
                                                setShowApplications(false);
                                                handleVisualize();
                                            }}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            Use This Example
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-1">Real-World Tools:</h4>
                                    <p className="text-gray-600">{currentApplication.tools}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Further Reading:</h4>
                                    <p className="text-gray-600 text-sm">{currentApplication.reference}</p>
                                    <a
                                        href={currentApplication.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        View reference paper/documentation
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}