import { Application, Container, Graphics } from 'pixi.js';
import { Grid, GridChunk, GridConfig, GridInfo, Point } from '../types';

function toGrid(info: GridInfo, position: Point): GridChunk | null {
  let colIndex = -1;
  let rowIndex = -1;
  for (let row = 0; row < info.chunks.length; row++) {
    const col = info.chunks[row][0];
    if (position.y >= col.y && position.y <= col.y + info.chunkSize.y) {
      rowIndex = row;
      break;
    }
  }
  if (rowIndex === -1) {
    return null;
  }
  for (let col = 0; col < info.chunks[0].length; col++) {
    const c = info.chunks[0][col];
    if (position.x >= c.x && position.x <= c.x + info.chunkSize.x) {
      colIndex = col;
      break;
    }
  }
  if (colIndex === -1) {
    return null;
  }
  const chunk = info.chunks[rowIndex][colIndex];
  return {
    height: info.chunkSize.y,
    width: info.chunkSize.x,
    index: [rowIndex, colIndex],
    position: chunk,
  };
}

export function createGrid(
  game: Application,
  { height, position, chunkCount, width }: GridConfig,
): Grid {
  const info: GridInfo = {
    position,
    height,
    width,
    chunkSize: {
      x: width / chunkCount.x,
      y: height / chunkCount.y,
    },
    chunks: [],
  };
  const graphics = new Container();
  graphics.alpha = 0;

  function calcChunks() {
    graphics.removeChildren();
    for (let row = 0; row < chunkCount.y; row++) {
      const y = position.y + row * info.chunkSize.y;
      info.chunks.push([]);
      for (let col = 0; col < chunkCount.x; col++) {
        info.chunks[row].push({
          x: position.x + col * info.chunkSize.x,
          y,
        });
      }
    }
    for (let row = 0; row < info.chunks.length; row++) {
      const col = info.chunks[row][0];
      const line = new Graphics();
      line.lineStyle({
        color: 0xff0000,
        width: 1,
      });
      line.moveTo(col.x, col.y);
      line.lineTo(col.x + info.width, col.y);
      graphics.addChild(line);
    }
    {
      const col = info.chunks[info.chunks.length - 1][0];
      const line = new Graphics();
      line.lineStyle({
        color: 0xff0000,
        width: 1,
      });
      line.moveTo(col.x, col.y + info.chunkSize.y);
      line.lineTo(col.x + info.width, col.y + info.chunkSize.y);
      graphics.addChild(line);
    }
    for (let col = 0; col < info.chunks[0].length; col++) {
      const c = info.chunks[0][col];
      const line = new Graphics();
      line.lineStyle({
        color: 0xff0000,
        width: 1,
      });
      line.moveTo(c.x, c.y);
      line.lineTo(c.x, c.y + info.height);
      graphics.addChild(line);
    }
    {
      const c = info.chunks[0][info.chunks[0].length - 1];
      const line = new Graphics();
      line.lineStyle({
        color: 0xff0000,
        width: 1,
      });
      line.moveTo(c.x + info.chunkSize.x, c.y);
      line.lineTo(c.x + info.chunkSize.x, c.y + info.height);
      graphics.addChild(line);
    }
  }
  calcChunks();

  game.stage.addChild(graphics);

  return {
    show() {
      graphics.alpha = 0.5;
    },
    hide() {
      graphics.alpha = 0;
    },
    moveTo(pos) {
      info.position.x = pos.x;
      info.position.y = pos.y;
      calcChunks();
    },
    setSize(data) {
      info.width = data.width;
      info.height = data.height;
      calcChunks();
    },
    toGrid(pos) {
      return toGrid(info, pos);
    },
    getCell(pos) {
      const chunk = info.chunks[pos.y][pos.x];
      if (chunk) {
        return {
          height: info.chunkSize.y,
          width: info.chunkSize.x,
          index: [pos.x, pos.y],
          position: chunk,
        };
      }
      return null;
    },
  };
}
