import { useEffect, useCallback, useRef } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { bfs } from '../algorithms/bfs';
import { dijkstra } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { dfs } from '../algorithms/dfs';
import { greedy } from '../algorithms/greedy';
import { bellmanFord } from '../algorithms/bellmanFord';
import { floydWarshall } from '../algorithms/floydWarshall';
import { bidirectional } from '../algorithms/bidirectional';
import { jumpPoint } from '../algorithms/jumpPoint';
import { getNodesInShortestPathOrder } from '../algorithms/bfs';
import { Node } from '../types';

export const useVisualizer = () => {
  const {
    grid,
    startNode,
    endNode,
    isRunning,
    isPaused,
    speed,
    currentAlgorithm,
    setGrid,
    setError,
    setIsRunning,
  } = useVisualizerStore();

  const animationFrameId = useRef<number | undefined>(undefined);
  const visitedNodesRef = useRef<Node[]>([]);
  const pathNodesRef = useRef<Node[]>([]);
  const currentIndexRef = useRef(0);
  const isVisualizingPathRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const gridRef = useRef(grid);

  // Update gridRef when grid changes
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const getAlgorithm = useCallback(() => {
    switch (currentAlgorithm) {
      case 'BFS':
        return bfs;
      case 'DFS':
        return dfs;
      case 'Dijkstra':
        return dijkstra;
      case 'A*':
        return astar;
      case 'Greedy':
        return greedy;
      case 'BellmanFord':
        return bellmanFord;
      case 'FloydWarshall':
        return floydWarshall;
      case 'Bidirectional':
        return bidirectional;
      case 'JumpPoint':
        return jumpPoint;
      default:
        return bfs;
    }
  }, [currentAlgorithm]);

  const animate = useCallback(() => {
    if (!isRunning || isPaused) {
      isAnimatingRef.current = false;
      return;
    }

    const currentTime = performance.now();
    const timeSinceLastUpdate = currentTime - lastUpdateTimeRef.current;
    const delay = 1000 / (speed + 1);

    if (timeSinceLastUpdate < delay) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    lastUpdateTimeRef.current = currentTime;

    // Create a deep copy of the grid
    const newGrid = gridRef.current.map(row => 
      row.map(node => ({
        ...node,
        previousNode: node.previousNode // Preserve the previousNode reference
      }))
    );

    if (currentIndexRef.current < visitedNodesRef.current.length && !isVisualizingPathRef.current) {
      const node = visitedNodesRef.current[currentIndexRef.current];
      if (node.type !== 'start' && node.type !== 'end') {
        newGrid[node.row][node.col].isVisited = true;
      }
      currentIndexRef.current++;
    } else if (!isVisualizingPathRef.current) {
      isVisualizingPathRef.current = true;
      currentIndexRef.current = 0;
    } else if (currentIndexRef.current < pathNodesRef.current.length) {
      const node = pathNodesRef.current[currentIndexRef.current];
      if (node.type !== 'start' && node.type !== 'end') {
        newGrid[node.row][node.col].isPath = true;
      }
      currentIndexRef.current++;
    } else {
      setIsRunning(false);
      isAnimatingRef.current = false;
      return;
    }

    setGrid(newGrid);
    animationFrameId.current = requestAnimationFrame(animate);
  }, [isRunning, isPaused, speed, setGrid, setIsRunning]);

  const visualizeAlgorithm = useCallback(async () => {
    if (!startNode || !endNode) {
      setError('Please place both start and end nodes');
      return;
    }

    if (isAnimatingRef.current) {
      return;
    }

    try {
      isAnimatingRef.current = true;

      // Create a deep copy of the grid for the algorithm
      const algorithmGrid = gridRef.current.map(row => 
        row.map(node => ({
          ...node,
          isVisited: false,
          isPath: false,
          distance: node.type === 'start' ? 0 : Infinity,
          fScore: Infinity,
          previousNode: null,
        }))
      );

      // Get the actual start and end nodes from the algorithm grid
      const start = algorithmGrid[startNode.row][startNode.col];
      const end = algorithmGrid[endNode.row][endNode.col];

      const algorithm = getAlgorithm();
      const visitedNodesInOrder = algorithm(algorithmGrid, start, end);
      
      if (!visitedNodesInOrder || visitedNodesInOrder.length === 0) {
        setError('No path found');
        isAnimatingRef.current = false;
        return;
      }

      const nodesInShortestPathOrder = getNodesInShortestPathOrder(end);
      if (!nodesInShortestPathOrder || nodesInShortestPathOrder.length === 0) {
        setError('No path found');
        isAnimatingRef.current = false;
        return;
      }

      // Update the grid with the initial state
      setGrid(algorithmGrid);
      
      // Set up animation data
      visitedNodesRef.current = visitedNodesInOrder;
      pathNodesRef.current = nodesInShortestPathOrder;
      currentIndexRef.current = 0;
      isVisualizingPathRef.current = false;
      lastUpdateTimeRef.current = performance.now();

      // Start animation
      animationFrameId.current = requestAnimationFrame(animate);
    } catch (error) {
      setError('An error occurred during visualization');
      console.error(error);
      isAnimatingRef.current = false;
    }
  }, [startNode, endNode, setGrid, setError, getAlgorithm, animate]);

  useEffect(() => {
    if (isRunning && !isPaused && !isAnimatingRef.current) {
      visualizeAlgorithm();
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimatingRef.current = false;
    };
  }, [isRunning, isPaused]);
}; 