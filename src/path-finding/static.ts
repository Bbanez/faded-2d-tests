import { Grid, Point } from '../types';
import { createCircleFunction } from '../util';
import { Chunk, ChunkGroup, Edge, Map, Node } from './types';

export function pathFindingStaticPart({
  mapData,
  grid,
}: {
  mapData: number[][];
  grid: Grid;
}): Map {
  const chunks: {
    [id: string]: Chunk;
  } = {};
  const chunkGroups: {
    [id: string]: ChunkGroup;
  } = {};
  const nodes: {
    [id: string]: Node;
  } = {};
  const edges: {
    [id: string]: Edge;
  } = {};
  const map: Map = {
    chunkGroups: [],
    chunks: [],
    edges: [],
    nodes: [],
  };

  function createNode({
    chunkId,
    next,
    nodeId,
    pos,
  }: {
    nodeId: string;
    chunkId: string;
    next: string;
    pos: Point;
  }): Node {
    if (nodes[nodeId]) {
      nodes[nodeId].chunkIds.push(chunkId);
      return nodes[nodeId];
    } else {
      return {
        id: '' + nodeId,
        chunkIds: ['' + chunkId],
        c: createCircleFunction({ origin: Object.assign({}, pos), r: 20 }),
        next,
      };
    }
  }

  // Create Chunks and Nodes
  for (let row = 0; row < mapData.length; row++) {
    for (let col = 0; col < mapData[row].length; col++) {
      const mapPoint = mapData[row][col];
      if (mapPoint > 0) {
        const gridChunk = grid.getCell({ x: col, y: row });
        if (gridChunk) {
          const chunk: Chunk = {
            groupId: '',
            id: gridChunk.position.x + '-' + gridChunk.position.y,
            nodes: [] as never,
          };
          const ns: Node[] = [];
          // top-left
          let nodePos = gridChunk.position;
          let nodeId = nodePos.x + '-' + nodePos.y;
          let node = createNode({
            chunkId: chunk.id,
            nodeId,
            pos: nodePos,
            next: undefined as never,
          });
          ns.push(node);
          // top-right
          nodePos = {
            x: gridChunk.position.x + gridChunk.width,
            y: gridChunk.position.y,
          };
          nodeId = nodePos.x + '-' + nodePos.y;
          node = createNode({
            chunkId: chunk.id,
            nodeId,
            pos: nodePos,
            next: undefined as never,
          });
          ns.push(node);
          // bottom-right
          nodePos = {
            x: gridChunk.position.x + gridChunk.width,
            y: gridChunk.position.y + gridChunk.height,
          };
          nodeId = nodePos.x + '-' + nodePos.y;
          node = createNode({
            chunkId: chunk.id,
            nodeId,
            pos: nodePos,
            next: undefined as never,
          });
          ns.push(node);
          // bottom-left
          nodePos = {
            x: gridChunk.position.x,
            y: gridChunk.position.y + gridChunk.height,
          };
          nodeId = nodePos.x + '-' + nodePos.y;
          node = createNode({
            chunkId: chunk.id,
            nodeId,
            pos: nodePos,
            next: undefined as never,
          });
          ns.push(node);
          for (let i = 0; i < ns.length; i++) {
            const n = ns[i];
            chunk.nodes.push(n.id);
          }
          chunks[chunk.id] = chunk;
        }
      }
    }
  }

  // Create ChunkGroups and Edges
  const nodeIds = Object.keys(nodes);
  for (let i = 0; i < nodeIds.length; i++) {
    const node = nodes[nodeIds[i]];
    
  }
  return map;
}
