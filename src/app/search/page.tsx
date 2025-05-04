"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import * as d3 from "d3"
import {
  ChevronLeft,
  FileText,
  BarChart2,
  Code,
  Binary,
  Lightbulb,
  Info,
  Maximize,
  Minimize,
  RefreshCw,
  Upload,
  Zap,
  Copy,
  ExternalLink,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"

interface HuffmanNode {
  id: string
  char: string | null
  freq: number
  left: HuffmanNode | null
  right: HuffmanNode | null
  code: string
  isLeaf(): boolean
  getDepth(): number
}

interface FrequencyMap {
  [key: string]: number
}

interface Codebook {
  [key: string]: string
}

interface TreeState {
  [key: string]: {
    node: HuffmanNode
    position: { x: number; y: number } | null
    merged: boolean
    children?: string[]
  }
}

interface AnimationHistoryItem {
  forest: {
    [key: string]: {
      node: HuffmanNode
      position: { x: number; y: number } | null
      merged: boolean
      children?: string[]
    }
  }
  nodes: HuffmanNode[]
  mergedPair: [HuffmanNode, HuffmanNode] | null
  newNode: HuffmanNode | null
  treeState: TreeState
  step: number
}

// Add type annotations for D3 data structures
interface D3Node extends d3.SimulationNodeDatum {
  id: string
  x: number
  y: number
  fx: number | null
  fy: number | null
  char?: string
  freq: number
  merged?: boolean
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: D3Node
  target: D3Node
  value: number
}

// Sample texts for quick testing
const sampleTexts = [
  { name: "Hello World", text: "hello world" },
  { name: "Lorem Ipsum", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { name: "Pangram", text: "The quick brown fox jumps over the lazy dog." },
  { name: "Repeated Pattern", text: "AAABBBCCCDDDEEE" },
  { name: "Code Sample", text: "function huffman(text) { return encode(buildTree(text)); }" },
]

export default function HuffmanEncodingVisualizer() {
  const [inputText, setInputText] = useState("hello world")
  const [frequencies, setFrequencies] = useState<FrequencyMap>({})
  const [huffmanTree, setHuffmanTree] = useState<HuffmanNode | null>(null)
  const [codebook, setCodebook] = useState<Codebook>({})
  const [encodedText, setEncodedText] = useState("")
  const [decodedText, setDecodedText] = useState("")
  const [decodingInput, setDecodingInput] = useState("")
  const [animationHistory, setAnimationHistory] = useState<AnimationHistoryItem[]>([])
  const [highlightedChar, setHighlightedChar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(1000) // Animation speed in ms
  const [activeTab, setActiveTab] = useState("visualization")
  const [fullscreenTree, setFullscreenTree] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const svgWidth = 800
  const svgHeight = 600

  // Node class for Huffman Tree
  class Node implements HuffmanNode {
    char: string | null
    freq: number
    left: HuffmanNode | null
    right: HuffmanNode | null
    code: string
    id: string

    constructor(char: string | null, freq: number) {
      this.char = char
      this.freq = freq
      this.left = null
      this.right = null
      this.code = ""
      // Generate a unique ID for each node
      this.id = char !== null ? `char_${char}` : `internal_${Math.random().toString(36).substr(2, 9)}`
    }

    // Helper method to check if this is a leaf node
    isLeaf(): boolean {
      return this.char !== null
    }

    // Helper method to get the depth of the node in the tree
    getDepth(): number {
      const leftDepth = this.left ? this.left.getDepth() : 0
      const rightDepth = this.right ? this.right.getDepth() : 0
      return 1 + Math.max(leftDepth, rightDepth)
    }
  }

  // Calculate character frequencies from input text
  const calculateFrequencies = (text: string): FrequencyMap => {
    const freqs: FrequencyMap = {}
    for (const char of text) {
      freqs[char] = (freqs[char] || 0) + 1
    }
    return freqs
  }

  // Build Huffman Tree with detailed steps for animation
  const buildHuffmanTree = (freqs: FrequencyMap): HuffmanNode | null => {
    if (Object.keys(freqs).length === 0) return null

    // Special case: only one unique character
    if (Object.keys(freqs).length === 1) {
      const char = Object.keys(freqs)[0]
      const root = new Node(null, freqs[char])
      const leafNode = new Node(char, freqs[char])
      root.left = leafNode
      return root
    }

    // Create leaf nodes for each character
    const nodes: HuffmanNode[] = Object.entries(freqs)
      .map(([char, freq]) => new Node(char, freq))
      .sort((a, b) => {
        // First sort by frequency
        if (a.freq !== b.freq) {
          return a.freq - b.freq
        }
        // If frequencies are equal, sort by character code for deterministic results
        if (a.char && b.char) {
          return a.char.localeCompare(b.char)
        }
        // If one is internal and one is leaf, put leaf first
        if (a.char && !b.char) return -1
        if (!a.char && b.char) return 1
        return 0
      })

    // Build the tree by repeatedly combining the two lowest frequency nodes
    while (nodes.length > 1) {
      // Take the two nodes with lowest frequencies
      const left = nodes.shift()!
      const right = nodes.shift()!

      // Create a new internal node with these two nodes as children
      const internalNode = new Node(null, left.freq + right.freq)
      internalNode.left = left
      internalNode.right = right

      // Insert the new node back into the sorted array
      let insertIndex = 0
      while (insertIndex < nodes.length && nodes[insertIndex].freq <= internalNode.freq) {
        insertIndex++
      }
      nodes.splice(insertIndex, 0, internalNode)
    }

    return nodes[0] || null
  }

  // Generate codes from Huffman Tree
  const generateCodes = (node: HuffmanNode | null, code = ""): Codebook => {
    if (!node) return {}

    // Special case: tree with only one node (one unique character)
    if (node.left && node.left.char && !node.right) {
      return { [node.left.char]: "0" }
    }

    const codes: Codebook = {}

    // Helper function to traverse the tree and assign codes
    const traverse = (currentNode: HuffmanNode | null, currentCode: string) => {
      if (!currentNode) return

      // If this is a leaf node (character node)
      if (currentNode.char !== null) {
        codes[currentNode.char] = currentCode
        return
      }

      // Traverse left (add '0')
      if (currentNode.left) {
        traverse(currentNode.left, currentCode + "0")
      }

      // Traverse right (add '1')
      if (currentNode.right) {
        traverse(currentNode.right, currentCode + "1")
      }
    }

    // Start traversal from root
    traverse(node, "")

    return codes
  }

  // Encode text using the codebook
  const encodeText = (text: string, codes: Codebook): string => {
    return text
      .split("")
      .map((char) => codes[char] || "")
      .join("")
  }

  // Decode binary text using the Huffman Tree
  const decodeText = (binary: string, root: HuffmanNode | null): string => {
    if (!root || !binary) return ""

    // Special case: tree with only one unique character
    if (root.left && root.left.char && !root.right) {
      // Count the number of '0's in the binary string
      const count = binary.split("").filter((bit) => bit === "0").length
      return root.left.char.repeat(count)
    }

    let result = ""
    let currentNode: HuffmanNode | null = root

    for (const bit of binary) {
      if (!currentNode) break

      if (bit === "0") {
        currentNode = currentNode.left
      } else if (bit === "1") {
        currentNode = currentNode.right
      }

      // If we reach a leaf node, add its character to the result
      if (currentNode?.char) {
        result += currentNode.char
        currentNode = root // Reset to the root for the next character
      }
    }

    return result
  }

  // Process the input text
  useEffect(() => {
    if (!inputText) {
      setFrequencies({})
      setHuffmanTree(null)
      setCodebook({})
      setEncodedText("")
      return
    }

    setIsLoading(true)

    // Calculate frequencies
    const freqs = calculateFrequencies(inputText)
    setFrequencies(freqs)

    // Build Huffman Tree
    const tree = buildHuffmanTree(freqs)
    setHuffmanTree(tree)

    // Generate codebook
    const codes = generateCodes(tree)
    setCodebook(codes)

    // Encode the text
    const encoded = encodeText(inputText, codes)
    setEncodedText(encoded)

    setIsLoading(false)
    setCurrentStep(0) // Reset animation step
  }, [inputText])

  // Decode input when decoding input changes
  useEffect(() => {
    if (huffmanTree && decodingInput) {
      const decoded = decodeText(decodingInput, huffmanTree)
      setDecodedText(decoded)
    } else {
      setDecodedText("")
    }
  }, [decodingInput, huffmanTree])

  // D3 visualization that updates based on the current tree state
  useEffect(() => {
    if (!huffmanTree || !svgRef.current) return

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)

    // Create a container group if it doesn't exist
    let g: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select("g.main-container")
    if (g.empty()) {
      // First time setup - clear and create new elements
      svg.selectAll("*").remove()

      // Create the main container
      g = svg
        .append("g")
        .attr("class", "main-container")
        .attr("transform", `translate(${svgWidth / 2}, 50)`)

      // Create defs for gradient effects and markers
      const defs = svg.append("defs")

      // Add arrow marker for directed edges
      defs
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .append("path")
        .attr("d", "M 0,-5 L 10,0 L 0,5")
        .attr("fill", "#999")

      // Add gradients for different node types
      const gradients = [
        {
          id: "charGradient",
          colors: [
            { offset: "0%", color: "rgb(217, 70, 239)" }, // fuchsia-500
            { offset: "100%", color: "rgb(139, 92, 246)" }, // violet-500
          ],
        },
        {
          id: "internalGradient",
          colors: [
            { offset: "0%", color: "rgb(192, 132, 252)" }, // purple-400
            { offset: "100%", color: "rgb(139, 92, 246)" }, // violet-500
          ],
        },
      ]

      gradients.forEach((g) => {
        const gradient = defs
          .append("linearGradient")
          .attr("id", g.id)
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "100%")

        g.colors.forEach((stop) => {
          gradient.append("stop").attr("offset", stop.offset).attr("stop-color", stop.color)
        })
      })

      // Add glow filter
      const filter = defs.append("filter").attr("id", "glow")

      filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur")

      const feMerge = filter.append("feMerge")
      feMerge.append("feMergeNode").attr("in", "coloredBlur")
      feMerge.append("feMergeNode").attr("in", "SourceGraphic")

      // Add zoom behavior
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform)
        })

      svg.call(zoom as any).on("dblclick.zoom", null) // Disable double-click zoom

      // Create link and node containers to maintain z-order
      g.append("g").attr("class", "links-container")
      g.append("g").attr("class", "nodes-container")
    }

    // References to the containers
    const linksContainer = g.select(".links-container")
    const nodesContainer = g.select(".nodes-container")

    // Convert tree to hierarchy for d3.tree layout
    const convertToHierarchy = (node: HuffmanNode | null): any => {
      if (!node) return null

      // Handle special case for single character
      if (node.left && node.left.char && !node.right) {
        return {
          id: node.id,
          name: "root",
          freq: node.freq,
          char: null,
          children: [
            {
              id: node.left.id,
              name: node.left.char || "internal",
              freq: node.left.freq,
              char: node.left.char,
              children: [],
            },
          ],
        }
      }

      return {
        id: node.id,
        name: node.char || "internal",
        freq: node.freq,
        char: node.char,
        children: [
          node.left ? convertToHierarchy(node.left) : null,
          node.right ? convertToHierarchy(node.right) : null,
        ].filter(Boolean),
      }
    }

    const hierarchyData = convertToHierarchy(huffmanTree)
    if (!hierarchyData) return

    // Calculate tree layout with proper spacing
    const treeLayout = d3
      .tree<any>()
      .size([svgWidth - 100, svgHeight - 100])
      .nodeSize([80, 100])

    const root = d3.hierarchy(hierarchyData)
    const treeData = treeLayout(root)

    // Create links
    const linkData = treeData.links()
    const links = linksContainer
      .selectAll<SVGPathElement, any>(".tree-link")
      .data(linkData, (d) => `${d.source.data.id}-${d.target.data.id}`)

    // Handle exiting links
    links.exit().transition().duration(500).style("opacity", 0).remove()

    // Enter new links
    const linkEnter = links
      .enter()
      .append("path")
      .attr("class", "tree-link")
      .attr(
        "d",
        d3
          .linkVertical<any, any>()
          .x((d) => d.x)
          .y((d) => d.y),
      )
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("stroke-width", (d) => Math.max(1, Math.sqrt(d.target.data.freq) / 2))
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", "url(#arrowhead)")
      .style("opacity", 0)

    // Animate new links
    linkEnter.transition().duration(750).style("opacity", 1)

    // Update existing links
    links
      .transition()
      .duration(750)
      .attr(
        "d",
        d3
          .linkVertical<any, any>()
          .x((d) => d.x)
          .y((d) => d.y),
      )
      .attr("stroke-width", (d) => Math.max(1, Math.sqrt(d.target.data.freq) / 2))

    // Add edge labels (0 for left, 1 for right)
    const edgeLabels = linksContainer
      .selectAll<SVGTextElement, any>(".edge-label")
      .data(linkData, (d) => `label-${d.source.data.id}-${d.target.data.id}`)

    // Handle exiting edge labels
    edgeLabels.exit().transition().duration(500).style("opacity", 0).remove()

    // Create new edge labels
    const edgeLabelEnter = edgeLabels
      .enter()
      .append("text")
      .attr("class", "edge-label")
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 8)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#555")
      .attr("stroke", "white")
      .attr("stroke-width", "3")
      .attr("stroke-opacity", "0.8")
      .attr("paint-order", "stroke")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => {
        // Correctly determine if this is a left (0) or right (1) child
        // Check if this node is the left child of its parent
        const isLeftChild = d.source.children && d.source.children.length > 0 && d.source.children[0] === d.target
        return isLeftChild ? "0" : "1"
      })

    // Animate edge labels
    edgeLabelEnter.transition().duration(750).style("opacity", 1)

    // Update existing edge labels
    edgeLabels
      .transition()
      .duration(750)
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2 - 8)

    // Create nodes
    const nodes = nodesContainer.selectAll<SVGGElement, any>(".node").data(treeData.descendants(), (d) => d.data.id)

    // Handle exiting nodes
    nodes.exit().transition().duration(500).style("opacity", 0).remove()

    // Create new nodes
    const nodeEnter = nodes
      .enter()
      .append("g")
      .attr("class", (d) => `node ${d.data.char ? "leaf-node" : "internal-node"}`)
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("opacity", 0)

    // Add circles for nodes
    nodeEnter
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => (d.data.char ? "url(#charGradient)" : "url(#internalGradient)"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    // Add character labels
    nodeEnter
      .append("text")
      .attr("class", "char-label")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text((d) => {
        if (d.data.char) {
          return d.data.char === " " ? "␣" : d.data.char
        }
        return "•"
      })

    // Add frequency labels with better formatting
    nodeEnter
      .append("text")
      .attr("class", "freq-label")
      .attr("dy", "1.5em")
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-size", "10px")
      .style("opacity", 0)
      .text((d) => {
        if (d.data.char) {
          // For leaf nodes, show character and frequency
          return `${d.data.char === " " ? "Space" : d.data.freq}`
        } else {
          // For internal nodes, just show frequency
          return d.data.freq
        }
      })

    // Animate new nodes
    nodeEnter
      .transition()
      .duration(750)
      .style("opacity", 1)
      .select("circle")
      .attr("r", (d) => (d.data.char ? 25 : 20))

    nodeEnter.selectAll("text").transition().duration(750).style("opacity", 1)

    // Update existing nodes
    const nodeUpdate = nodes
      .transition()
      .duration(750)
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("opacity", 1)

    nodeUpdate
      .select("circle")
      .attr("r", (d) => (d.data.char ? 25 : 20))
      .attr("fill", (d) => (d.data.char ? "url(#charGradient)" : "url(#internalGradient)"))

    // Update frequency labels for existing nodes
    nodeUpdate.select(".freq-label").text((d) => {
      if (d.data.char) {
        return `${d.data.char === " " ? "Space" : d.data.freq}`
      } else {
        return d.data.freq
      }
    })

    // Add code text to leaf nodes
    nodes.filter(".leaf-node").each(function (d) {
      if (d.data.char && codebook[d.data.char]) {
        const code = codebook[d.data.char]
        const nodeGroup = d3.select(this)

        // Remove any existing code text
        nodeGroup.select(".code-text").remove()

        // Add the new code text
        nodeGroup
          .append("text")
          .attr("class", "code-text")
          .attr("y", 45)
          .attr("text-anchor", "middle")
          .attr("fill", "#333")
          .style("font-family", "monospace")
          .style("font-size", "12px")
          .style("opacity", 0)
          .text(code)
          .transition()
          .duration(500)
          .style("opacity", 1)
      }
    })

    // Add node interactions
    nodes
      .on("mouseover", function (event, d) {
        // Highlight this node
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.data.char ? 30 : 25)
          .attr("filter", "url(#glow)")

        // Highlight path to root
        let current = d
        while (current.parent) {
          // Highlight the link
          linksContainer
            .selectAll(".tree-link")
            .filter((link: any) => link.target === current)
            .transition()
            .duration(200)
            .attr("stroke", "#d946ef") // fuchsia-500
            .attr("stroke-width", 3)

          // Highlight the parent
          nodesContainer
            .selectAll(".node")
            .filter((node: any) => node === current.parent)
            .select("circle")
            .transition()
            .duration(200)
            .attr("stroke", "#d946ef") // fuchsia-500
            .attr("stroke-width", 3)

          current = current.parent
        }

        // If this is a leaf node, highlight the character in the frequency table
        if (d.data.char) {
          setHighlightedChar(d.data.char)
        }
      })
      .on("mouseout", function (event, d) {
        // Reset node highlight
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.data.char ? 25 : 20)
          .attr("filter", null)

        // Reset link highlights
        linksContainer
          .selectAll(".tree-link")
          .transition()
          .duration(200)
          .attr("stroke", "#aaa")
          .attr("stroke-width", (d) => Math.max(1, Math.sqrt((d as any).target.data.freq) / 2))

        // Reset node highlights
        nodesContainer
          .selectAll(".node circle")
          .transition()
          .duration(200)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)

        // Reset highlighted character
        setHighlightedChar(null)
      })
  }, [huffmanTree, codebook, highlightedChar])

  // Calculate total bits before and after compression
  const originalBits = inputText.length * 8 // Assuming 8 bits per character
  const compressedBits = encodedText.length
  const compressionRatio = originalBits > 0 ? ((originalBits - compressedBits) / originalBits) * 100 : 0

  // Calculate average bits per character
  const avgBitsPerChar =
    Object.keys(codebook).length > 0
      ? Object.entries(codebook).reduce((sum, [char, code]) => {
        const freq = frequencies[char] || 0
        return sum + code.length * freq
      }, 0) / inputText.length
      : 0

  // Function to copy encoded text to clipboard
  const copyEncodedText = () => {
    navigator.clipboard.writeText(encodedText)
  }

  // Function to handle sample text selection
  const handleSampleTextSelect = (text: string) => {
    setInputText(text)
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <Header />
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 text-center mb-16">
          Huffman Encoding Visualizer
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Input Text:</label>
                <textarea
                  className="w-full h-32 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to encode..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Sample Texts:</label>
                <div className="space-y-2">
                  {sampleTexts.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleTextSelect(sample.text)}
                      className="w-full px-4 py-2 text-left bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Original size:</span>
                <span className="font-medium">{originalBits} bits</span>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Compressed size:</span>
                <span className="font-medium">{compressedBits} bits</span>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Space saved:</span>
                <span className="font-medium text-green-500">{compressionRatio.toFixed(2)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <BarChart2 size={16} />
                <span className="hidden sm:inline">Visualization</span>
                <span className="sm:hidden">Viz</span>
              </TabsTrigger>
              <TabsTrigger value="encoding" className="flex items-center gap-2">
                <Code size={16} />
                <span className="hidden sm:inline">Encoding</span>
                <span className="sm:hidden">Encode</span>
              </TabsTrigger>
              <TabsTrigger value="decoding" className="flex items-center gap-2">
                <Binary size={16} />
                <span className="hidden sm:inline">Decoding</span>
                <span className="sm:hidden">Decode</span>
              </TabsTrigger>
            </TabsList>

            {/* Visualization Tab */}
            <TabsContent value="visualization" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Huffman Tree Visualization */}
                <div className={`${fullscreenTree ? "lg:col-span-3" : "lg:col-span-2"}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <BarChart2 className="text-fuchsia-500" size={20} />
                        Huffman Tree
                      </h2>
                      <button
                        onClick={() => setFullscreenTree(!fullscreenTree)}
                        className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                      >
                        {fullscreenTree ? <Minimize size={18} /> : <Maximize size={18} />}
                      </button>
                    </div>

                    <div className="relative">
                      <svg
                        ref={svgRef}
                        width={svgWidth}
                        height={svgHeight}
                        className="mx-auto border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800"
                      ></svg>

                      {/* Tree legend */}
                      <div className="absolute top-2 right-2 bg-white dark:bg-zinc-800 p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm text-xs">
                        <div className="flex items-center mb-1">
                          <span className="inline-block w-3 h-3 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full mr-1"></span>
                          <span>Character Node</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full mr-1"></span>
                          <span>Internal Node</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <p>
                        <span className="font-medium">Tip:</span> Hover over nodes to see the path from root. Click on a
                        character node to highlight it in the frequency table.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Frequency Table and Codebook */}
                {!fullscreenTree && (
                  <div className="lg:col-span-1 space-y-6">
                    {/* Frequency Table */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                    >
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BarChart2 className="text-fuchsia-500" size={20} />
                        Character Frequencies
                      </h2>
                      <div className="overflow-auto max-h-64">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                          <thead className="bg-zinc-50 dark:bg-zinc-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                Character
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                Frequency
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
                            {Object.entries(frequencies).map(([char, freq], index) => (
                              <tr
                                key={index}
                                className={`hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors ${highlightedChar === char
                                  ? "bg-fuchsia-100 dark:bg-fuchsia-900/20 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/20"
                                  : ""
                                  }`}
                                onClick={() => setHighlightedChar(highlightedChar === char ? null : char)}
                              >
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {char === " " ? "Space" : char}
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="text-sm text-zinc-500 dark:text-zinc-400">{freq}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>

                    {/* Codebook */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                    >
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Code className="text-fuchsia-500" size={20} />
                        Huffman Codes
                      </h2>
                      <div className="overflow-auto max-h-64">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                          <thead className="bg-zinc-50 dark:bg-zinc-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                Character
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                Code
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                Bits
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
                            {Object.entries(codebook).map(([char, code], index) => (
                              <tr
                                key={index}
                                className={`hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors ${highlightedChar === char
                                  ? "bg-fuchsia-100 dark:bg-fuchsia-900/20 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/20"
                                  : ""
                                  }`}
                                onClick={() => setHighlightedChar(highlightedChar === char ? null : char)}
                              >
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {char === " " ? "Space" : char}
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="font-mono text-sm text-fuchsia-600 dark:text-fuchsia-400">{code}</div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="text-sm text-zinc-500 dark:text-zinc-400">{code.length}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <p>Average bits per character: {avgBitsPerChar.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* AI Assistant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Lightbulb className="text-amber-500" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">How Huffman Encoding Works</h3>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      Huffman coding is a lossless data compression algorithm that assigns variable-length codes to
                      characters based on their frequencies. More frequent characters get shorter codes, while less
                      frequent ones get longer codes.
                    </p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                      The algorithm builds a binary tree (the Huffman tree) where each leaf node represents a character.
                      The path from the root to a leaf defines the binary code for that character. Left branches are
                      labeled with 0, and right branches with 1.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Encoding Tab */}
            <TabsContent value="encoding" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Encoding Process */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Code className="text-fuchsia-500" size={20} />
                    Encoding Process
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Step 1: Count Frequencies</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Count how often each character appears in the input text. These frequencies determine the
                        optimal code lengths.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Step 2: Build Huffman Tree</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Create leaf nodes for each character, then repeatedly combine the two nodes with lowest
                        frequencies until only one node remains (the root).
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Step 3: Generate Binary Codes
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Traverse the tree from root to each leaf, assigning 0 for left branches and 1 for right
                        branches. The path to each leaf becomes the code for its character.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Step 4: Encode the Text</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Replace each character in the original text with its corresponding binary code.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Encoded Output */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Binary className="text-fuchsia-500" size={20} />
                      Encoded Output
                    </h2>
                    <button
                      onClick={copyEncodedText}
                      className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg text-sm transition-colors flex items-center gap-1"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                    <code className="font-mono text-sm break-all">{encodedText}</code>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Original size:</span>
                      <span className="font-medium">{originalBits} bits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Compressed size:</span>
                      <span className="font-medium">{compressedBits} bits</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Space saved:</span>
                      <span className="font-medium text-green-500">{compressionRatio.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Average bits per character:</span>
                      <span className="font-medium">{avgBitsPerChar.toFixed(2)} (vs. 8 in ASCII)</span>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/30">
                    <div className="flex items-start gap-2">
                      <Info className="text-fuchsia-500 mt-0.5" size={18} />
                      <div>
                        <h3 className="font-medium mb-1 text-fuchsia-700 dark:text-fuchsia-300">
                          Huffman Coding Properties
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                          <li>Huffman codes are prefix-free (no code is a prefix of another)</li>
                          <li>The algorithm produces optimal prefix codes</li>
                          <li>
                            Compression efficiency depends on character distribution (works best with skewed
                            frequencies)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Character Encoding Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="text-fuchsia-500" size={20} />
                  Character Encoding Visualization
                </h2>

                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <div className="font-mono text-sm">
                      {inputText.split("").map((char, index) => {
                        const code = codebook[char] || ""
                        return (
                          <div
                            key={index}
                            className={`inline-flex flex-col items-center mx-1 mb-4 ${highlightedChar === char ? "bg-fuchsia-100 dark:bg-fuchsia-900/20 rounded-lg p-1" : ""
                              }`}
                          >
                            <span className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 mb-1">
                              {char === " " ? "␣" : char}
                            </span>
                            <span className="bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded text-fuchsia-600 dark:text-fuchsia-400">
                              {code}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Decoding Tab */}
            <TabsContent value="decoding" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Decoding Process */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Binary className="text-fuchsia-500" size={20} />
                    Decoding Process
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Step 1: Start at the Root Node
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Begin at the root of the Huffman tree for each new character to decode.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Step 2: Follow the Bit Path</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Read each bit of the encoded text. For 0, go to the left child; for 1, go to the right child.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Step 3: Identify Characters</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        When you reach a leaf node, output its character and return to the root to start decoding the
                        next character.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Step 4: Continue Until Complete
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Repeat the process until all bits in the encoded text have been processed.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/30">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="text-amber-500 mt-0.5" size={18} />
                      <div>
                        <h3 className="font-medium mb-1 text-fuchsia-700 dark:text-fuchsia-300">Why Decoding Works</h3>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          Huffman codes are uniquely decodable because no code is a prefix of another code (prefix-free
                          property). This ensures that as you traverse the tree, there's only one possible
                          interpretation of the bit sequence.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decoder Tool */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="text-fuchsia-500" size={20} />
                    Decoder Tool
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        Binary Input:
                      </label>
                      <div className="flex gap-2">
                        <textarea
                          className="w-full h-24 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-fuchsia-400 font-mono"
                          value={decodingInput}
                          onChange={(e) => setDecodingInput(e.target.value)}
                          placeholder="Enter binary string to decode..."
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setDecodingInput(encodedText)}
                            className="p-2 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                            title="Use encoded text"
                          >
                            <Upload size={18} />
                          </button>
                          <button
                            onClick={() => setDecodingInput("")}
                            className="p-2 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                            title="Clear"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 text-zinc-700 dark:text-zinc-300">Decoded Result:</h3>
                      <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg min-h-24 border border-zinc-200 dark:border-zinc-700">
                        <p className="break-words">{decodedText}</p>
                      </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                      <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Verification</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Input matches original text:</span>
                        <span
                          className={`font-medium ${decodedText === inputText ? "text-green-500" : "text-red-500"}`}
                        >
                          {decodedText === inputText ? "Yes ✓" : "No ✗"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Real-world Applications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 border border-zinc-200 dark:border-zinc-700"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="text-fuchsia-500" size={20} />
                  Real-world Applications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">File Compression</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Huffman coding is used in compression formats like DEFLATE (used in ZIP, PNG, and GZIP). It's
                      often combined with other techniques for better compression ratios.
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">Data Transmission</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Used to reduce bandwidth requirements when transmitting data over networks, especially in
                      resource-constrained environments.
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">JPEG Image Compression</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      JPEG uses Huffman coding as part of its compression pipeline to encode the quantized DCT
                      coefficients.
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-zinc-700 dark:text-zinc-300">MP3 Audio Compression</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      MP3 and other audio formats use Huffman coding to compress the frequency data after psychoacoustic
                      modeling.
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-fuchsia-50 to-violet-50 dark:from-fuchsia-900/20 dark:to-violet-900/20 p-4 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800/30">
                  <div className="flex items-start gap-2">
                    <Info className="text-fuchsia-500 mt-0.5" size={18} />
                    <div>
                      <h3 className="font-medium mb-1 text-fuchsia-700 dark:text-fuchsia-300">
                        Historical Significance
                      </h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Developed by David Huffman in 1952 while he was a Ph.D. student at MIT, Huffman coding was a
                        breakthrough in information theory and remains one of the most efficient and elegant compression
                        algorithms. It's a perfect example of how frequency distribution can be exploited to optimize
                        data representation.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
