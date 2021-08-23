import './styles/main.scss';

import { Application } from 'pixi.js';
import { pathFinding } from './path-finding';
import { TickerService } from './services';
import { createLine, printLine } from './models';
import { createLineFunction } from './util';

window.addEventListener('load', async () => {
  const area = document.getElementById('game') as HTMLCanvasElement;
  const game = new Application({
    view: area,
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x8822ee,
  });

  game.ticker.add(() => {
    TickerService.tick();
  });
  const line1 = createLineFunction({
    start: { x: 0, y: 0 },
    end: { x: window.innerWidth, y: window.innerHeight },
  });
  const parallel1 = line1.getParallel({ x: 200, y: 300 });
  const normal1 = line1.getNormal({ x: 200, y: 100 });
  printLine(game, { line: line1 });
  printLine(game, { line: parallel1 });
  printLine(game, { line: normal1 });

  await pathFinding(game);
});
