import { Application } from 'pixi.js';
import { createCircle, createGrid, createRect } from '../models';
import { Grid, GridChunk } from '../types';
import { Assets, getPixelData, loadAssets, loopMatrix } from '../util';
import { Map, MapChunk, MapChunkNode } from './types';

export async function pathFinding(game: Application): Promise<void> {
  const gridSize = 400;
  const grid = createGrid(game, {
    chunkCount: { x: 10, y: 10 },
    width: gridSize,
    height: gridSize,
    position: {
      x: window.innerWidth / 2 - gridSize / 2,
      y: window.innerHeight / 2 - gridSize / 2,
    },
  });
  grid.show();

  await loadAssets(
    game,
    [
      {
        name: 'nogo',
        path: '/nogo.png',
      },
    ],
    (progress) => {
      console.log('Loading', progress);
    },
  );
  const mapData = getPixelData({
    game,
    sprite: Assets.nogo,
    color: 'r',
  });
  loopMatrix(mapData, (value, col, row) => {
    if (value > 0) {
      const chunk = grid.getCell({
        x: row,
        y: col,
      });
      if (chunk) {
        createRect(game, {
          position: {
            x: chunk.position.x + chunk.width / 2,
            y: chunk.position.y + chunk.height / 2,
          },
          width: chunk.width,
          height: chunk.height,
          angle: 0,
          color: 0xee00ee,
        });
      }
    }
  });
  const map = staticPart({ mapData, grid });
  console.log(map);
  map.chunks.forEach((chunk) => {
    chunk.nodes.forEach((node) => {
      let color = 0x009900;
      if (node.connecting) {
        color = 0x00ff00;
      }
      createCircle(game, {
        position: node.pos,
        color,
        size: 3,
      });
    });
  });
}

function s2(
  {
    mapData,
    grid,
  }: {
    mapData: number[][];
    grid: Grid;
  }
)

function staticPart({
  mapData,
  grid,
}: {
  mapData: number[][];
  grid: Grid;
}): Map {
  const map: Map = {
    chunkGroups: [],
    chunks: [],
  };
  const nodes: {
    [position]
  }

  function createChunk(
    gridChunk: GridChunk,
    col: number,
    row: number,
  ): MapChunk {
    return {
      groupIndex: -1,
      pos: gridChunk.position,
      nodes: [
        {
          connecting: false,
          pos: gridChunk.position,
          r: 50,
        },
        {
          connecting: false,
          pos: {
            x: gridChunk.position.x + gridChunk.width,
            y: gridChunk.position.y,
          },
          r: 50,
        },
        {
          connecting: false,
          pos: {
            x: gridChunk.position.x + gridChunk.width,
            y: gridChunk.position.y + gridChunk.height,
          },
          r: 50,
        },
        {
          connecting: false,
          pos: {
            x: gridChunk.position.x,
            y: gridChunk.position.y + gridChunk.height,
          },
          r: 50,
        },
      ],
      size: {
        x: gridChunk.width,
        y: gridChunk.height,
      },
      gridInfo: {
        col,
        row,
      },
    };
  }
  function findNeighbor(
    mapChunk: MapChunk,
    col: number,
    row: number,
    nodeIndex: number,
  ) {
    const mapPoint = mapData[row][col];
    if (mapPoint > 0 && !mapChunk.nodes[nodeIndex].connecting) {
      let neighborChunkIndex = -1;
      let neighborChunk: MapChunk | null = null;
      for (let i = 0; i < map.chunks.length; i++) {
        const chunk = map.chunks[i];
        if (chunk.gridInfo.col === col && chunk.gridInfo.row === row) {
          neighborChunkIndex = i;
          neighborChunk = chunk;
          break;
        }
      }
      if (neighborChunk) {
        const neighborChunkNodeIndex = neighborChunk.nodes.findIndex(
          (node) =>
            node.pos.x === mapChunk.nodes[nodeIndex].pos.x &&
            node.pos.y === mapChunk.nodes[nodeIndex].pos.y,
        );
        if (neighborChunkNodeIndex !== -1) {
          mapChunk.nodes[nodeIndex].connecting = true;
          mapChunk.nodes[nodeIndex].connectedChunkIndex = neighborChunkIndex;
        }
      } else {
        console.log('no neighbor', { c: mapChunk.gridInfo, t: { col, row } });
      }
    }
  }

  for (let row = 0; row < mapData.length; row++) {
    for (let col = 0; col < mapData[row].length; col++) {
      const mapPoint = mapData[row][col];
      if (mapPoint > 0) {
        const gridChunk = grid.getCell({ x: col, y: row });
        if (gridChunk) {
          map.chunks.push(createChunk(gridChunk, col, row));
        }
      }
    }
  }
  for (let i = 0; i < map.chunks.length; i++) {
    const chunk = map.chunks[i];
    // TOP
    if (mapData[chunk.gridInfo.row - 1]) {
      // LEFT
      if (mapData[chunk.gridInfo.row - 1][chunk.gridInfo.col - 1] > 0) {
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col - 1,
          chunk.gridInfo.row - 1,
          0,
        );
      }
      // CENTER
      if (mapData[chunk.gridInfo.row - 1][chunk.gridInfo.col] > 0) {
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col,
          chunk.gridInfo.row - 1,
          0,
        );
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col,
          chunk.gridInfo.row - 1,
          1,
        );
      }
      // RIGHT
      if (mapData[chunk.gridInfo.row - 1][chunk.gridInfo.col + 1] > 0) {
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col + 1,
          chunk.gridInfo.row - 1,
          1,
        );
      }
    }
    // RIGHT
    if (mapData[chunk.gridInfo.row][chunk.gridInfo.col + 1] > 0) {
      findNeighbor(
        map.chunks[i],
        chunk.gridInfo.col + 1,
        chunk.gridInfo.row,
        1,
      );
      findNeighbor(
        map.chunks[i],
        chunk.gridInfo.col + 1,
        chunk.gridInfo.row,
        2,
      );
    }
    // BOTTOM
    if (mapData[chunk.gridInfo.row + 1]) {
      // LEFT
      if (mapData[chunk.gridInfo.row + 1][chunk.gridInfo.col - 1] > 0) {
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col - 1,
          chunk.gridInfo.row + 1,
          3,
        );
      }
      // CENTER
      if (mapData[chunk.gridInfo.row + 1][chunk.gridInfo.col] > 0) {
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col,
          chunk.gridInfo.row + 1,
          2,
        );
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col,
          chunk.gridInfo.row + 1,
          3,
        );
      }
      // RIGHT
      if (mapData[chunk.gridInfo.row + 1][chunk.gridInfo.col + 1] > 0) {
        findNeighbor(
          map.chunks[i],
          chunk.gridInfo.col + 1,
          chunk.gridInfo.row + 1,
          2,
        );
      }
    }
    // LEFT
    if (mapData[chunk.gridInfo.row][chunk.gridInfo.col - 1] > 0) {
      findNeighbor(
        map.chunks[i],
        chunk.gridInfo.col - 1,
        chunk.gridInfo.row,
        3,
      );
      findNeighbor(
        map.chunks[i],
        chunk.gridInfo.col - 1,
        chunk.gridInfo.row,
        0,
      );
    }
  }
  return map;
}
