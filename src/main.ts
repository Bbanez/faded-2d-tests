import './styles/main.scss';

import { Application } from 'pixi.js';
import { createGrid, createRect } from './models';

window.addEventListener('load', async () => {
  const area = document.getElementById('game') as HTMLCanvasElement;
  const game = new Application({
    view: area,
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xba4630,
  });
  const rect = createRect(game, {
    angle: 0,
    color: 0x000000,
    height: 100,
    width: 500,
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
  });
  const grid = createGrid(game, {
    chunkCount: { x: 10, y: 10 },
    width: 1200,
    height: 1200,
    position: {
      x: window.innerWidth / 2 - 600,
      y: window.innerHeight / 2 - 600,
    },
  });
  grid.show();

  window.addEventListener('mouseup', (event) => {
    const chunk = grid.toGrid({
      x: event.clientX,
      y: event.clientY,
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
  });

  const timeOffset = Date.now();
  game.ticker.add(() => {
    const t = (Date.now() - timeOffset) / 1000;
    game.renderer.render(game.stage);
    rect.g.angle += 0.5;
    const widthShift = 5 * Math.cos(t);
    const heightShift = 2 * Math.sin(t / 2);
    rect.g.width += widthShift;
    rect.g.height += heightShift;
  });
});
