"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

interface HuffmanNode {
  id: string;
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  code: string;
}

interface FrequencyMap {
  [key: string]: number;
}

interface Codebook {
  [key: string]: string;
}

interface TreeState {
  [key: string]: {
    node: HuffmanNode;
    position: { x: number; y: number } | null;
    merged: boolean;
    children?: string[];
  };
}

interface AnimationHistoryItem {
  forest: {
    [key: string]: {
      node: HuffmanNode;
      position: { x: number; y: number } | null;
      merged: boolean;
      children?: string[];
    };
  };
  nodes: HuffmanNode[];
  mergedPair: [HuffmanNode, HuffmanNode] | null;
  newNode: HuffmanNode | null;
  treeState: TreeState;
  step: number;
}

export default function HuffmanEncodingVisualizer() {
  const [inputText, setInputText] = useState('hello world');
  const [frequencies, setFrequencies] = useState<FrequencyMap>({});
  const [huffmanTree, setHuffmanTree] = useState<HuffmanNode | null>(null);
  const [codebook, setCodebook] = useState<Codebook>({});
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [decodingInput, setDecodingInput] = useState('');
  const [animationHistory, setAnimationHistory] = useState<AnimationHistoryItem[]>([]);
  const [highlightedChar, setHighlightedChar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Animation speed in ms

  const svgRef = useRef<SVGSVGElement>(null);
  const svgWidth = 800;
  const svgHeight = 600;

  // Node class for Huffman Tree
  class Node implements HuffmanNode {
    char: string | null;
    freq: number;
    left: HuffmanNode | null;
    right: HuffmanNode | null;
    code: string;
    id: string;

    constructor(char: string | null, freq: number) {
      this.char = char;
      this.freq = freq;
      this.id = char !== null ? char : `internal_${Math.random().toString(36).substr(2, 9)}`;
      this.left = null;
      this.right = null;
      this.code = '';
    }
  }

  // Calculate character frequencies from input text
  const calculateFrequencies = (text: string): FrequencyMap => {
    const freqs: FrequencyMap = {};
    for (const char of text) {
      freqs[char] = (freqs[char] || 0) + 1;
    }
    return freqs;
  };

  // Build Huffman Tree with detailed steps for animation
  const buildHuffmanTree = (freqs: FrequencyMap): HuffmanNode | null => {
    if (Object.keys(freqs).length === 0) return null;

    // Create leaf nodes for each character
    const nodes: HuffmanNode[] = Object.keys(freqs).map(char => new Node(char, freqs[char]));

    // Initialize animation history with just leaf nodes
    const history: AnimationHistoryItem[] = [];

    // Create a copy of the initial nodes for history
    const initialForest: TreeState = {};
    nodes.forEach((node, index) => {
      initialForest[node.id] = {
        node: _.cloneDeep(node),
        position: { x: index * 80, y: 40 },
        merged: false
      };
    });

    // First step in history has just the leaf nodes
    history.push({
      forest: _.cloneDeep(initialForest),
      nodes: _.cloneDeep(nodes),
      mergedPair: null,
      newNode: null,
      treeState: _.cloneDeep(initialForest),
      step: 0
    });

    // Priority queue simulation using array and sorting
    const workingNodes = [...nodes];
    let internalNodeCounter = 0;

    // Track the tree as it's being built
    const treeState: TreeState = _.cloneDeep(initialForest);

    let step = 1;
    while (workingNodes.length > 1) {
      // Sort nodes by frequency
      workingNodes.sort((a, b) => a.freq - b.freq);

      // Take the two nodes with lowest frequencies
      const left = workingNodes.shift();
      const right = workingNodes.shift();

      if (!left || !right) break;

      // Create a new internal node with these two nodes as children
      const internalId = `internal_${internalNodeCounter++}`;
      const newNode = new Node(null, left.freq + right.freq);
      newNode.id = internalId;
      newNode.left = left;
      newNode.right = right;

      // Add the new node back to the queue
      workingNodes.push(newNode);

      // Update the forest for animation history
      const forest = _.cloneDeep(history[history.length - 1].forest);

      // Mark the merged nodes
      if (forest[left.id]) {
        forest[left.id].merged = true;
      }
      if (forest[right.id]) {
        forest[right.id].merged = true;
      }

      // Calculate position for the new node
      const leftPos = forest[left.id].position || { x: 0, y: 0 };
      const rightPos = forest[right.id].position || { x: 0, y: 0 };

      // Position the new node between its children but one level up
      const newPos = {
        x: (leftPos.x + rightPos.x) / 2,
        y: Math.min(leftPos.y, rightPos.y) - 80  // Up one level
      };

      // Add the new internal node to the forest
      forest[internalId] = {
        node: newNode,
        position: newPos,
        merged: false,
        children: [left.id, right.id]
      };

      // Update tree state with new connections
      treeState[internalId] = {
        node: newNode,
        position: newPos,
        merged: false,
        children: [left.id, right.id]
      };

      // Save this state to history
      history.push({
        forest: forest,
        nodes: _.cloneDeep(workingNodes),
        mergedPair: [left, right],
        newNode: newNode,
        treeState: _.cloneDeep(treeState),
        step: step
      });

      step++;
    }

    setAnimationHistory(history);

    // The final tree is the last remaining node
    return workingNodes[0] || null;
  };

  // Generate codes from Huffman Tree
  const generateCodes = (node: HuffmanNode | null, code: string = ''): Codebook => {
    if (!node) return {};

    if (node.char) {
      return { [node.char]: code };
    }

    const leftCodes = generateCodes(node.left, code + '0');
    const rightCodes = generateCodes(node.right, code + '1');

    return { ...leftCodes, ...rightCodes };
  };

  // Encode text using the codebook
  const encodeText = (text: string, codes: Codebook): string => {
    return text.split('').map(char => codes[char] || '').join('');
  };

  // Decode binary text using the Huffman Tree
  const decodeText = (binary: string, root: HuffmanNode | null): string => {
    if (!root || !binary) return '';

    let result = '';
    let currentNode: HuffmanNode | null = root;

    for (const bit of binary) {
      if (!currentNode) break;

      if (bit === '0') {
        currentNode = currentNode.left;
      } else if (bit === '1') {
        currentNode = currentNode.right;
      }

      // If we reach a leaf node, add its character to the result
      if (currentNode?.char) {
        result += currentNode.char;
        currentNode = root; // Reset to the root for the next character
      }
    }

    return result;
  };

  // Process the input text
  useEffect(() => {
    if (!inputText) {
      setFrequencies({});
      setHuffmanTree(null);
      setCodebook({});
      setEncodedText('');
      return;
    }

    setIsLoading(true);

    // Calculate frequencies
    const freqs = calculateFrequencies(inputText);
    setFrequencies(freqs);

    // Build Huffman Tree
    const tree = buildHuffmanTree(freqs);
    setHuffmanTree(tree);

    // Generate codebook
    const codes = generateCodes(tree);
    setCodebook(codes);

    // Encode the text
    const encoded = encodeText(inputText, codes);
    setEncodedText(encoded);

    setIsLoading(false);
    setCurrentStep(0); // Reset animation step
  }, [inputText]);

  // Decode input when decoding input changes
  useEffect(() => {
    if (huffmanTree && decodingInput) {
      const decoded = decodeText(decodingInput, huffmanTree);
      setDecodedText(decoded);
    } else {
      setDecodedText('');
    }
  }, [decodingInput, huffmanTree]);

  // Animation controller
  const startAnimation = () => {
    if (!animationHistory.length) return;

    setIsAnimating(true);
    setCurrentStep(0);

    // Start animation sequence
    animateNextStep();
  };

  const animateNextStep = () => {
    if (currentStep >= animationHistory.length - 1) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return;
    }

    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, animationSpeed);
  };

  // Watch for step changes and animate accordingly
  useEffect(() => {
    if (isAnimating && currentStep < animationHistory.length - 1) {
      animateNextStep();
    }
  }, [currentStep, isAnimating]);

  // D3 visualization that updates based on animation step
  useEffect(() => {
    if (!animationHistory.length || !svgRef.current) return;

    const currentHistory = animationHistory[currentStep];
    if (!currentHistory) return;

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);

    // Clear the SVG
    svg.selectAll("*").remove();

    // Create a container group with a transform
    const g = svg.append("g")
      .attr("transform", `translate(${svgWidth / 2}, 40)`);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // First, draw all the nodes
    const nodeGroups = g.selectAll(".node")
      .data(Object.entries(currentHistory.forest), (d: any) => d[0])
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", ([id]) => `node-${id}`)
      .attr("transform", ([, node]) => {
        const pos = node.position || { x: 0, y: 0 };
        return `translate(${pos.x}, ${pos.y})`;
      })
      .style("opacity", ([, node]) => node.merged ? 0.5 : 1);

    // Add circles for nodes
    nodeGroups.append("circle")
      .attr("r", 25)
      .attr("fill", ([id, node]) => {
        // Highlight nodes being merged in this step
        if (currentHistory.mergedPair &&
          (currentHistory.mergedPair[0].id === id ||
            currentHistory.mergedPair[1].id === id)) {
          return "#ffd700"; // Gold for nodes being merged
        }
        // New node from last merge
        if (currentHistory.newNode && currentHistory.newNode.id === id) {
          return "#ff6347"; // Tomato for new node
        }
        // Normal coloring
        return node.node.char ? "#4dabf7" : "#69db7c"; // Blue for char nodes, green for internals
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text for character or frequency
    nodeGroups.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .text(([, node]) => {
        if (node.node.char) {
          return node.node.char === ' ' ? 'space' : node.node.char;
        }
        return "";
      });

    // Add text for frequency
    nodeGroups.append("text")
      .attr("dy", "1.5em")
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", "10px")
      .text(([, node]) => node.node.freq);

    // Now, draw links between nodes
    const links = g.selectAll(".link")
      .data(Object.entries(currentHistory.forest).filter(([, node]) => node.children?.length))
      .enter();

    // For each parent, draw lines to its children
    Object.entries(currentHistory.forest).forEach(([id, node]) => {
      if (node.children?.length) {
        node.children.forEach(childId => {
          const childNode = currentHistory.forest[childId];
          if (childNode && childNode.position && node.position) {
            g.append("line")
              .attr("class", "link")
              .attr("x1", node.position.x)
              .attr("y1", node.position.y)
              .attr("x2", childNode.position.x)
              .attr("y2", childNode.position.y)
              .attr("stroke", "#999")
              .attr("stroke-width", 2);
          }
        });
      }
    });

    // Highlight the current step description
    const stepDescription = document.getElementById("step-description");
    if (stepDescription) {
      let description = "";
      if (currentStep === 0) {
        description = "Initial forest with leaf nodes for each character.";
      } else if (currentHistory.mergedPair && currentHistory.newNode) {
        const [left, right] = currentHistory.mergedPair;
        const leftChar = left.char ? (left.char === ' ' ? 'space' : `'${left.char}'`) : `internal (${left.freq})`;
        const rightChar = right.char ? (right.char === ' ' ? 'space' : `'${right.char}'`) : `internal (${right.freq})`;
        description = `Step ${currentStep}: Merging ${leftChar} (${left.freq}) and ${rightChar} (${right.freq}) into a new node with frequency ${currentHistory.newNode.freq}.`;
      }
      stepDescription.textContent = description;
    }

  }, [currentStep, animationHistory, svgWidth, svgHeight]);

  // Calculate total bits before and after compression
  const originalBits = inputText.length * 8; // Assuming 8 bits per character
  const compressedBits = encodedText.length;
  const compressionRatio = originalBits > 0 ? ((originalBits - compressedBits) / originalBits * 100).toFixed(2) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Huffman Encoding Visualization</h1>
          <p className="mt-2 text-gray-100">
            An interactive tool to understand data compression using Huffman coding
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Input Text</h2>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to encode..."
              />
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span className="mr-2">Original size: {originalBits} bits</span>
                <span className="mx-2">|</span>
                <span className="ml-2">Compressed: {compressedBits} bits</span>
                <span className="mx-2">|</span>
                <span className="ml-2">Saved: {compressionRatio}%</span>
              </div>
            </div>

            {/* Frequency Table */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Character Frequencies</h2>
              <div className="overflow-auto max-h-64">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(frequencies).map(([char, freq], index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 cursor-pointer ${highlightedChar === char ? 'bg-purple-100' : ''}`}
                        onClick={() => setHighlightedChar(highlightedChar === char ? null : char)}
                      >
                        <td className="px-6 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {char === ' ' ? 'Space' : char}
                          </div>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{freq}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Animation Controls */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Tree Construction</h2>

              <div className="space-y-4">
                {/* Animation controls */}
                <div className="flex space-x-2">
                  <button
                    className="flex-grow bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    onClick={startAnimation}
                    disabled={isLoading || isAnimating || animationHistory.length === 0}
                  >
                    {isAnimating ? "Animating..." : "Build Tree Step-by-Step"}
                  </button>

                  <button
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => setCurrentStep(0)}
                    disabled={isLoading || currentStep === 0}
                  >
                    Reset
                  </button>
                </div>

                {/* Animation speed slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animation Speed: {animationSpeed}ms
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>

                {/* Step control */}
                {animationHistory.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <button
                        className="text-purple-600 hover:text-purple-800 disabled:text-gray-400"
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0 || isAnimating}
                      >
                        ← Previous
                      </button>
                      <span className="text-sm font-medium">
                        Step {currentStep} of {animationHistory.length - 1}
                      </span>
                      <button
                        className="text-purple-600 hover:text-purple-800 disabled:text-gray-400"
                        onClick={() => setCurrentStep(prev => Math.min(animationHistory.length - 1, prev + 1))}
                        disabled={currentStep === animationHistory.length - 1 || isAnimating}
                      >
                        Next →
                      </button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${(currentStep / (animationHistory.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Step description */}
                <div
                  id="step-description"
                  className="text-sm text-gray-600 p-2 bg-gray-100 rounded-md min-h-12 mt-2"
                >
                  {currentStep === 0
                    ? "Initial forest with leaf nodes for each character."
                    : "Building the Huffman tree..."}
                </div>
              </div>
            </div>

            {/* Codebook */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Huffman Codes</h2>
              <div className="overflow-auto max-h-64">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Character</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bits</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(codebook).map(([char, code], index) => (
                      <tr
                        key={index}
                        className={`hover:bg-gray-100 cursor-pointer ${highlightedChar === char ? 'bg-purple-100' : ''}`}
                        onClick={() => setHighlightedChar(highlightedChar === char ? null : char)}
                      >
                        <td className="px-6 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {char === ' ' ? 'Space' : char}
                          </div>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          <div className="font-mono text-sm text-blue-600">{code}</div>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{code.length}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Visualization and Encoding/Decoding */}
          <div className="lg:col-span-2">
            {/* Huffman Tree Visualization */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Huffman Tree Construction
                {isAnimating && <span className="ml-2 text-purple-600"> - Animating...</span>}
              </h2>
              <div className="relative">
                <svg
                  ref={svgRef}
                  width={svgWidth}
                  height={svgHeight}
                  className="mx-auto border border-gray-200 rounded-md bg-white"
                ></svg>

                {/* Tree legend */}
                <div className="absolute top-2 right-2 bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
                  <div className="flex items-center mb-1">
                    <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-1"></span>
                    <span>Character Node</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-1"></span>
                    <span>Internal Node</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1"></span>
                    <span>Merging Node</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-400 rounded-full mr-1"></span>
                    <span>New Node</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Encoded Output */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Encoded Output</h2>
              <div className="bg-gray-100 p-3 rounded-md overflow-x-auto">
                <code className="font-mono text-sm break-all">{encodedText}</code>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Original text requires {originalBits} bits (8 bits per character).</p>
                <p>Huffman encoded version requires {compressedBits} bits.</p>
                <p>Compression ratio: {compressionRatio}% space saved.</p>
              </div>
            </div>

            {/* Decoding Tool */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Decoder</h2>
              <textarea
                className="w-full h-16 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                value={decodingInput}
                onChange={(e) => setDecodingInput(e.target.value)}
                placeholder="Enter binary string to decode..."
              />
              <h3 className="text-lg font-medium mt-4 mb-2 text-gray-700">Decoded Result:</h3>
              <div className="bg-gray-100 p-3 rounded-md min-h-16">
                <p className="break-words">{decodedText}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>Huffman Encoding Visualization - A tool for understanding data compression</p>
        </div>
      </footer>
    </div>
  );
}