# Pathfinding Algorithm Visualizer

A web-based visualization tool for various pathfinding algorithms, built with Next.js, React, and Tailwind CSS.

## Features

- Interactive grid editor for placing start/end nodes, walls, and weights
- Support for multiple pathfinding algorithms:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - A\* Search Algorithm
  - Greedy Best-First Search
  - Bellman-Ford Algorithm
  - Floyd-Warshall Algorithm
  - Bidirectional Search
  - Jump Point Search
- Real-time visualization with step-by-step animations
- Adjustable visualization speed
- Algorithm information display (time/space complexity, optimality)
- Responsive design

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pathfinding-visualizer.git
   cd pathfinding-visualizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click on the grid to place the start node (green)
2. Click again to place the end node (red)
3. Click and drag to create walls (black) or weights (purple)
4. Select an algorithm from the dropdown menu
5. Adjust the visualization speed using the slider
6. Click "Start" to begin visualization
7. Use "Pause" and "Reset" buttons to control the visualization

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand (State Management)

## Project Structure

```
src/
├── algorithms/     # Pathfinding algorithm implementations
├── components/     # React components
├── hooks/         # Custom React hooks
├── store/         # State management
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
