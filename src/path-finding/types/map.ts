import { Point } from '../../types';

export interface Map {
  chunks: MapChunk[];
  chunkGroups: number[][];
}

export interface MapChunk {
  nodes: Array<{
    pos: Point;
    r: number;
    connecting: boolean;
    connectedChunkIndex?: number;
  }>;
  pos: Point;
  size: Point;
  groupIndex: number;
  gridInfo: {
    col: number;
    row: number;
  };
}
