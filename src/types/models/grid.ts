import { Point } from '../point';

export interface GridConfig {
  position: Point;
  width: number;
  height: number;
  chunkCount: Point;
}

export interface Grid {
  toGrid(position: Point): GridChunk | null;
  show(): void;
  hide(): void;
  moveTo(position: Point): void;
  setSize(data: { width: number; height: number }): void;
}

export interface GridChunk {
  index: [number, number];
  position: Point;
  width: number;
  height: number;
}

export interface GridInfo {
  position: Point;
  width: number;
  height: number;
  chunkSize: Point;
  chunks: Array<Point[]>;
}
