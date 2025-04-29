export interface Item {
  id: number;
  name: string;
  weight: number;
  worth: number;
  required?: boolean;
}

export interface KnapsackSolution {
  items: Item[];
  totalWeight: number;
  totalWorth: number;
  time: number;
}

export interface AlgorithmStep {
  item: Item;
  action: 'select' | 'skip';
  reason: string;
  currentWeight: number;
  currentWorth: number;
}

export interface DPStep {
  i: number;
  w: number;
  value: number;
  selected: boolean;
} 