# DAA for Kids - Interactive Algorithm Visualizer

A modern, interactive web application designed to help students and enthusiasts understand various algorithms through visualization. Built with Next.js, React, and Tailwind CSS.

![Project Banner](public/banner.png)

## 🚀 Features

### Pathfinding Visualizer

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
  - Segment Search
- Real-time visualization with step-by-step animations
- Adjustable visualization speed
- Algorithm information display (time/space complexity, optimality)

### Knapsack Problem Visualizer

- Interactive visualization of the 0/1 Knapsack problem
- Dynamic programming approach visualization
- Step-by-step explanation of the solution process
- Customizable item weights and values

### Split-Merge Algorithm Visualizer

- Visualization of external sorting algorithms
- Interactive demonstration of split and merge operations
- Real-world application examples
- Performance comparison

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **UI Components**: Radix UI
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/daa-for-kids.git
   cd daa-for-kids
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

## 🎮 Usage

### Pathfinding Visualizer

1. Click on the grid to place the start node (green)
2. Click again to place the end node (red)
3. Click and drag to create walls (black) or weights (purple)
4. Select an algorithm from the dropdown menu
5. Adjust the visualization speed using the slider
6. Click "Start" to begin visualization
7. Use "Pause" and "Reset" buttons to control the visualization

### Knapsack Problem

1. Enter the knapsack capacity
2. Add items with their weights and values
3. Visualize the dynamic programming solution
4. See the optimal selection of items

### Split-Merge Algorithm

1. Input your data set
2. Watch the split and merge operations
3. Understand the algorithm's efficiency
4. Compare with other sorting methods

## 📁 Project Structure

```
src/
├── app/            # Next.js app router pages
├── components/     # React components
│   ├── ui/        # Reusable UI components
│   ├── pathfinding/
│   ├── knapsack/
│   └── split-merge/
├── algorithms/     # Algorithm implementations
├── hooks/         # Custom React hooks
├── store/         # State management
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── lib/          # Shared libraries
```

## 🎨 Design System

The application uses a consistent design system with:

- Modern, clean UI
- Dark/light mode support
- Responsive design
- Accessible components
- Smooth animations

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## 📞 Contact

For any questions or suggestions, please open an issue in the repository.
