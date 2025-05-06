"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, LayoutGrid, Network, Package2, GitMerge, FileCode, GithubIcon, Moon, Sun, Linkedin } from "lucide-react"

export default function Home() {
    const [theme, setTheme] = useState<"light" | "dark">("light")
    const [selectedContributor, setSelectedContributor] = useState<number | null>(null)

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
        document.documentElement.classList.toggle("dark")
    }

    const contributors = [
        { name: "Muhammad Bilal", github: "muhamad-bilal", linkedin: "muhammad-billo", color: "fuchsia" },
        { name: "Abdullah Mustafa", github: "rimocide", linkedin: "abdullmusta", color: "violet" },
        { name: "Umer Sami", github: "MoUmerSami2004", linkedin: "muhammad-umer-sami", color: "pink" },
        { name: "Hamza Motiwala", github: "moti987", linkedin: "muhammad-hamza-motiwala-217647221", color: "purple" },
        { name: "Zarish Asim", github: "Zarish166", linkedin: "zarish-asim-23a391339", color: "fuchsia" },
    ]

    return (
        <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
            <div className="bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 min-h-screen transition-colors duration-300">
                {/* Header */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="h-6 w-6 text-fuchsia-500" />
                            <span className="font-bold text-lg">daa for kids</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.08),transparent_40%)]"></div>
                    </div>
                    <div className="container mx-auto px-4 py-16 md:py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-300 text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
                                </span>
                                Interactive Learning Platform
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                                Design and Analysis of{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500">
                                    Algorithms
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 mb-8">
                                Visualize complex algorithms through interactive tools designed for intuitive learning
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="#algorithms"
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white font-medium hover:opacity-90 transition-opacity"
                                >
                                    Explore Algorithms
                                </Link>
                                <a
                                    href="https://github.com/muhamad-bilal/daa-for-kids"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                >
                                    <GithubIcon size={20} />
                                    View Source
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Algorithm Cards */}
                <section id="algorithms" className="py-16 bg-white dark:bg-zinc-950">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-bold mb-12 text-center">
                                Interactive Algorithm <span className="text-fuchsia-500">Visualizations</span>
                            </h2>

                            <div className="space-y-8">
                                {/* Pathfinding Algorithm */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link href="/pathfinding" className="block">
                                        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-fuchsia-200 dark:hover:border-fuchsia-800 transition-colors">
                                            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-50 to-transparent dark:from-fuchsia-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-500 shrink-0">
                                                    <Network size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-fuchsia-500 transition-colors">
                                                            Pathfinding Algorithms
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-fuchsia-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                                        Visualize and compare Dijkstra's, A*, and other pathfinding algorithms in action. Understand
                                                        how different algorithms navigate through obstacles to find optimal paths.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300">
                                                            Dijkstra
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300">
                                                            A*
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300">
                                                            BFS
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300">
                                                            DFS
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Knapsack Problem */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link href="/knapsack" className="block">
                                        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors">
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-500 shrink-0">
                                                    <Package2 size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-violet-500 transition-colors">
                                                            Knapsack Problem
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                                        Explore dynamic programming solutions to the classic 0/1 Knapsack problem. Visualize how
                                                        algorithms optimize value selection within weight constraints.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                                                            Dynamic Programming
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                                                            Optimization
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                                                            Recursion
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Least Common Subsequences */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link href="/split-merge" className="block">
                                        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-pink-200 dark:hover:border-pink-800 transition-colors">
                                            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-transparent dark:from-pink-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 shrink-0">
                                                    <GitMerge size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-pink-500 transition-colors">
                                                            Least Common Subsequences
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                                        Visualize the split and merge algorithm for external sorting and database operations. See
                                                        how data is efficiently processed in chunks.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                                                            Divide & Conquer
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                                                            Sorting
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                                                            Merging
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Huffman Encoding */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="group"
                                >
                                    <Link href="/search" className="block">
                                        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0">
                                                    <FileCode size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-2xl font-semibold mb-3 group-hover:text-purple-500 transition-colors">
                                                            Huffman Encoding
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                                        Visualize search algorithms like Binary Search, Linear Search, and more. Understand how data
                                                        compression works through Huffman coding.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                                                            Compression
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                                                            Binary Trees
                                                        </span>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                                                            Encoding
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contributors */}
                <section className="py-16 bg-zinc-50 dark:bg-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-bold mb-12 text-center">
                                Meet Our <span className="text-fuchsia-500">Contributors</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {contributors.map((contributor, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        {selectedContributor !== index && (
                                            <motion.div
                                                layoutId={`contributor-${index}`}
                                                className="block p-6 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-fuchsia-200 dark:hover:border-fuchsia-800 hover:shadow-md transition-all cursor-pointer"
                                                onClick={() => setSelectedContributor(index)}
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div
                                                        className={`w-16 h-16 rounded-full bg-${contributor.color}-100 dark:bg-${contributor.color}-900/30 flex items-center justify-center text-${contributor.color}-500 mb-4`}
                                                    >
                                                        <span className="text-xl font-bold">{contributor.name.charAt(0)}</span>
                                                    </div>
                                                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{contributor.name}</h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">@{contributor.github}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <AnimatePresence>
                    {selectedContributor !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => setSelectedContributor(null)}
                        >
                            <motion.div
                                layoutId={`contributor-${selectedContributor}`}
                                className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className={`w-24 h-24 rounded-full bg-${contributors[selectedContributor].color}-100 dark:bg-${contributors[selectedContributor].color}-900/30 flex items-center justify-center text-${contributors[selectedContributor].color}-500 mb-6`}
                                    >
                                        <span className="text-3xl font-bold">{contributors[selectedContributor].name.charAt(0)}</span>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                                        {contributors[selectedContributor].name}
                                    </h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 mb-6">@{contributors[selectedContributor].github}</p>
                                    <div className="flex gap-4">
                                        <a
                                            href={`https://github.com/${contributors[selectedContributor].github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                                        >
                                            <GithubIcon size={20} />
                                            GitHub
                                        </a>
                                        <a
                                            href={`https://linkedin.com/in/${contributors[selectedContributor].linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                                        >
                                            <Linkedin size={20} />
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <LayoutGrid className="h-5 w-5 text-fuchsia-500" />
                                <span className="font-bold">daa for kids</span>
                                <span className="text-zinc-400 dark:text-zinc-500 text-sm ml-2">© {new Date().getFullYear()}</span>
                            </div>
                            <div className="flex gap-6">
                                <Link
                                    href="/about"
                                    className="text-zinc-600 dark:text-zinc-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 text-sm"
                                >
                                    About
                                </Link>
                                <a
                                    href="https://rimocide.github.io/daa-for-kids-docs/"
                                    className="text-zinc-600 dark:text-zinc-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 text-sm"
                                >
                                    Documentation
                                </a>
                                <a
                                    href="https://github.com/muhamad-bilal/daa-for-kids"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-600 dark:text-zinc-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-400 text-sm flex items-center gap-1"
                                >
                                    <GithubIcon size={14} />
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
