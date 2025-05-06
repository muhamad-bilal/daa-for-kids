import type { Node } from '../types';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra, getNodesInShortestPathOrder as dijkstraGetNodes } from './dijkstra';
import { astar, getNodesInShortestPathOrder as astarGetNodes } from './astar';
import { greedy } from './greedy';
import { bellmanFord, getNodesInShortestPathOrder as bellmanFordGetNodes } from './bellmanFord';
import { floydWarshall } from './floydWarshall';
import { bidirectional } from './bidirectional';
import { jumpPoint } from './jumpPoint';

export {
    bfs,
    dfs,
    dijkstra,
    astar,
    greedy,
    bellmanFord,
    floydWarshall,
    bidirectional,
    jumpPoint,
};

// Use dijkstra's getNodesInShortestPathOrder as the default implementation
export const getNodesInShortestPathOrder = (endNode: Node): Node[] => {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = endNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}; 