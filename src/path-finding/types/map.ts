import { Point } from '../../types';
import { Chunk, ChunkGroup } from './chunk';
import { Edge } from './edge';
import { Node } from './node';

export interface Map {
  chunks: Chunk[];
  chunkGroups: ChunkGroup[];
  nodes: Node[];
  edges: Edge[];
}

export interface _Map {
  chunks: MapChunk[];
  chunkGroups: number[][];
}

export interface MapChunkNode {
  pos: Point;
  r: number;
  connecting: boolean;
  connectedChunkIndex?: number;
}

export interface MapChunk {
  nodes: MapChunkNode[];
  pos: Point;
  size: Point;
  groupIndex: number;
  gridInfo: {
    col: number;
    row: number;
  };
}
