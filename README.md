# DAA for Kids - Interactive Algorithm Visualizer

Welcome to the **DAA for Kids** project, a modern and interactive web application meticulously crafted to enhance the understanding of various algorithms through dynamic visualization. Developed using Next.js, React, and Tailwind CSS, this platform aims to make the study of Design and Analysis of Algorithms (DAA) more intuitive and engaging for students and enthusiasts alike.

---

## Project Overview

The core vision of DAA for Kids is to bridge the gap between theoretical algorithmic concepts and practical comprehension. By providing real-time, step-by-step visualizations, the project allows users to see algorithms in action, fostering a deeper and more lasting understanding of how they work.

---

## Key Features

The project is structured around interactive visualizers for fundamental algorithms, designed to provide clear insights into their processes and behaviors.

### Pathfinding Algorithms

Explore graph traversal and path discovery with our comprehensive Pathfinding Visualizer. Interact with a grid to place obstacles and weights, then observe as various algorithms find paths.

* Interactive grid environment
* Support for a range of algorithms including BFS, DFS, Dijkstra's, A\*, Bellman-Ford, Floyd-Warshall, and more.
* Real-time step-by-step execution
* Adjustable speed control
* Display of algorithm characteristics (complexity, optimality)

### Knapsack Problem Visualizer

Understand the classic optimization challenge of the 0/1 Knapsack Problem.

* Interactive setup for knapsack capacity and item properties
* Visualization of the Dynamic Programming approach
* Step-by-step illustration of the DP table construction
* Comparison with the Greedy approach

### Longest Common Subsequence (LCS) Visualizer

Visualize the process of finding the longest common subsequence between two strings.

* Interactive input for strings
* Visualization of the Dynamic Programming table construction
* Step-by-step walkthrough of the algorithm's logic

### Huffman Encoding Visualizer

Learn the principles of data compression through Huffman coding.

* Input text to generate Huffman tree and codes
* Visualization of tree construction and code assignment
* Demonstration of encoding and decoding processes
* Comparison of original vs. compressed size

---

## Technology Stack

The project is built upon a robust and modern technology stack:

```
- Frontend Framework: Next.js 14
- UI Library: React
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: Zustand
- Animation: Framer Motion
- UI Components: Radix UI
- Icons: Lucide React
```

---

## Installation

To set up the project on your local machine, follow these steps:

1.  Clone the repository:

    ```bash
    git clone [https://github.com/yourusername/daa-for-kids.git](https://github.com/yourusername/daa-for-kids.git)
    cd daa-for-kids
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Usage

Navigate through the different visualizer modules to interact with the algorithms. Each module provides specific controls and visualizations tailored to the algorithm it demonstrates.

### Pathfinding Visualizer

1.  Click on the grid to place the start node (typically green).
2.  Click again to place the end node (typically red).
3.  Click and drag to add walls (obstacles) or weights (higher cost paths).
4.  Select your desired algorithm from the available options.
5.  Adjust the visualization speed using the slider.
6.  Initiate the visualization by clicking the "Start" button.
7.  Utilize the "Pause", "Resume", and "Reset" controls as needed.

### Knapsack Problem Visualizer

1.  Specify the knapsack's maximum weight capacity.
2.  Define items by entering their weight and value.
3.  Choose the visualization method (e.g., Dynamic Programming).
4.  Observe the process of filling the DP table and the final optimal selection.

### Longest Common Subsequence (LCS) Visualizer

1.  Input the two strings you wish to compare.
2.  Observe the construction of the Dynamic Programming table that computes the LCS length.
3.  Follow the steps to understand how the LCS is derived.

### Huffman Encoding Visualizer

1.  Enter the text you want to encode.
2.  View the generated character frequencies and the constructed Huffman tree.
3.  See the unique binary code assigned to each character.
4.  Explore the encoding and decoding processes.

---

## Project Structure

The codebase is organized to facilitate development and maintenance:

```
src/
├── app/            # Next.js app router pages and routing
├── components/     # Reusable React components
│   ├── ui/         # Generic UI elements (Radix UI based)
│   ├── pathfinding/ # Components specific to the Pathfinding visualizer
│   ├── knapsack/   # Components specific to the Knapsack visualizer
│   ├── lcs/        # Components specific to the LCS visualizer
│   ├── huffman/    # Components specific to the Huffman visualizer
│   └── split-merge/ # Components specific to the Split-Merge visualizer
├── algorithms/     # Implementations of the core algorithms
├── hooks/          # Custom React hooks for shared logic
├── store/          # Zustand store for global state management
├── types/          # TypeScript type definitions
├── utils/          # General utility functions
└── lib/            # Shared libraries or helper modules
```

---

## Contributing

We warmly welcome contributions from the community. Your efforts can help us improve and expand this educational resource.

* To report bugs or suggest new features, please [file an issue](https://github.com/muhamad-bilal/daa-for-kids/issues) on the GitHub repository.
* To contribute code, please refer to the detailed [Contributing Guide](https://rimocide.github.io/daa-for-kids-docs/contributing/).

---

## Acknowledgments

We are grateful for the foundational technologies and libraries that made this project possible:

* [Next.js](https://nextjs.org/)
* [React](https://reactjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Zustand](https://github.com/pmndrs/zustand)
* [Radix UI](https://www.radix-ui.com/)
* [Framer Motion](https://www.framer.com/motion/)
* [Lucide Icons](https://lucide.dev/)

---

## Contact

For general inquiries or discussions, please open an issue in the project's GitHub repository.

---

