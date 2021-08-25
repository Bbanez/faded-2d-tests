export interface Chunk {
  id: string;
  nodes: [string, string, string, string];
  groupId: string;
}

export interface ChunkGroup {
  id: string;
  chunks: string[];
}
