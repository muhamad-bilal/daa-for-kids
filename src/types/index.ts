export type NodeType = 'start' | 'end' | 'wall' | 'weight' | 'empty';

export interface Node {
  row: number;
  col: number;
  type: NodeType;
  weight: number;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  fScore: number;
  f: number;
  previousNode: Node | null;
}

export type Grid = Node[][];

export type Algorithm = 
  | 'BFS'
  | 'DFS'
  | 'Dijkstra'
  | 'A*'
  | 'Greedy'
  | 'BellmanFord'
  | 'FloydWarshall'
  | 'Bidirectional'
  | 'JumpPoint';

export interface AlgorithmInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimal: boolean;
  description: string;
  weighted?: boolean;
  unweighted?: boolean;
  informed?: boolean;
  complete?: boolean;
}

export interface VisualizerState {
  grid: Grid;
  startNode: Node | null;
  endNode: Node | null;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentAlgorithm: Algorithm;
  algorithmInfo: Record<Algorithm, AlgorithmInfo>;
  error: string | null;
  setGrid: (grid: Grid) => void;
  setStartNode: (node: Node | null) => void;
  setEndNode: (node: Node | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setSpeed: (speed: number) => void;
  setCurrentAlgorithm: (algorithm: Algorithm) => void;
  setError: (error: string | null) => void;
  resetGrid: () => void;
  generateRandomMap: () => void;
  visualizeAlgorithm: () => Promise<void>;
} 