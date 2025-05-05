export interface Node {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    isPath: boolean;
    distance: number;
    previousNode: Node | null;
}

export type Grid = Node[][]; 