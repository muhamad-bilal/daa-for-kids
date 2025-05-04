"use client"
import Header from "@/components/header"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Code, Lightbulb, Users, ExternalLink } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 transition-colors duration-300">
            <Header />
            <div className="container mx-auto px-4 max-w-4xl py-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 mb-8 text-center"
                >
                    About daa for kids
                </motion.h1>

                <div className="space-y-8">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-500 flex items-center gap-2">
                            <Lightbulb className="h-6 w-6" />
                            Our Mission
                        </h2>
                        <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            <p>
                                daa for kids was born from a simple but powerful realization: learning complex algorithms and data structures
                                shouldn't have to be overwhelming. During university studies, many students struggle to fully understand
                                key concepts through standard textbooks and lectures. Abstract ideas often feel disconnected from
                                practical applications.
                            </p>
                            <p>
                                We created daa for kids to make algorithm visualization accessible, interactive, and enjoyable. Our platform
                                breaks down complexity into visual explanations that anyone can understand, from beginners to advanced
                                learners.
                            </p>
                            <p>
                                This project is part of a broader educational initiative that includes{" "}
                                <Link
                                    href="https://os-for-kids.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-fuchsia-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors inline-flex items-center gap-1"
                                >
                                    os for kids <ExternalLink size={14} />
                                </Link>
                                , aimed at making traditionally difficult computer science subjects more approachable.
                            </p>
                            <p>
                                At daa for kids, we believe that with the right resources and approach, any concept can be made approachable
                                and enjoyable to learn. We're passionate about making education more inclusive, engaging, and effective.
                            </p>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-500 flex items-center gap-2">
                            <Code className="h-6 w-6" />
                            Available Visualizers
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-medium text-violet-500">Pathfinding Algorithms</h3>
                                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                                    Visualize how different algorithms find paths in a grid with obstacles and weighted nodes.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 ml-4">
                                    <li>Breadth-First Search (BFS)</li>
                                    <li>Depth-First Search (DFS)</li>
                                    <li>Dijkstra's Algorithm</li>
                                    <li>A* Search</li>
                                    <li>Greedy Best-First Search</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-violet-500">Knapsack Problem</h3>
                                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                                    Explore dynamic programming solutions to the classic 0/1 Knapsack problem, visualizing how algorithms
                                    optimize value selection within weight constraints.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 ml-4">
                                    <li>Greedy Approach</li>
                                    <li>Dynamic Programming Solution</li>
                                    <li>Algorithm Comparison</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-violet-500">Longest Common Subsequence (LCS)</h3>
                                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                                    Visualize how the LCS algorithm finds the longest subsequence common to two sequences through dynamic
                                    programming.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 ml-4">
                                    <li>DP Table Visualization</li>
                                    <li>Traceback Path</li>
                                    <li>Real-world Applications</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-violet-500">Huffman Encoding</h3>
                                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                                    Explore lossless data compression through Huffman coding, visualizing how variable-length codes are
                                    assigned based on character frequencies.
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 ml-4">
                                    <li>Huffman Tree Construction</li>
                                    <li>Encoding Process</li>
                                    <li>Decoding Process</li>
                                    <li>Compression Statistics</li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-500 flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            Platform Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                <h3 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Interactive Visualizations</h3>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
                                    <li>Step-by-step algorithm execution</li>
                                    <li>Adjustable visualization speed</li>
                                    <li>Interactive controls and inputs</li>
                                    <li>Real-time feedback and results</li>
                                </ul>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                <h3 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Educational Resources</h3>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
                                    <li>Algorithm explanations and complexity analysis</li>
                                    <li>Code implementations</li>
                                    <li>Real-world applications</li>
                                    <li>Comparative analysis between algorithms</li>
                                </ul>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                <h3 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">User Experience</h3>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
                                    <li>Intuitive, modern interface</li>
                                    <li>Dark and light mode support</li>
                                    <li>Responsive design for all devices</li>
                                    <li>Accessible controls and information</li>
                                </ul>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                                <h3 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Technical Features</h3>
                                <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
                                    <li>Built with Next.js and React</li>
                                    <li>Interactive D3.js visualizations</li>
                                    <li>Tailwind CSS for styling</li>
                                    <li>Framer Motion animations</li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-zinc-200 dark:border-zinc-700"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-500 flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Who It's For
                        </h2>
                        <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            <p>
                                <strong className="text-zinc-900 dark:text-zinc-100">Students:</strong> Whether you're taking your first
                                algorithms course or preparing for technical interviews, our visualizers help solidify your
                                understanding of key concepts.
                            </p>
                            <p>
                                <strong className="text-zinc-900 dark:text-zinc-100">Educators:</strong> Use our platform as a teaching
                                aid to demonstrate algorithm behavior in real-time, making complex topics more accessible to your
                                students.
                            </p>
                            <p>
                                <strong className="text-zinc-900 dark:text-zinc-100">Self-learners:</strong> Explore algorithms at your
                                own pace with interactive tools that make learning engaging and intuitive.
                            </p>
                            <p>
                                <strong className="text-zinc-900 dark:text-zinc-100">Professionals:</strong> Refresh your knowledge or
                                explore the nuances of different algorithms to make better decisions in your software development
                                projects.
                            </p>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 rounded-2xl shadow-xl p-6 border border-fuchsia-200 dark:border-fuchsia-800/30"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-fuchsia-600 dark:text-fuchsia-400">Get Started</h2>
                        <p className="text-zinc-700 dark:text-zinc-300 mb-6">
                            Ready to dive into algorithm visualization? Explore our interactive tools and enhance your understanding
                            of these fundamental computer science concepts.
                        </p>
                        <div className="flex justify-center">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Explore Visualizers
                            </Link>
                        </div>
                    </motion.section>
                </div>
            </div>
        </div>
    )
}
