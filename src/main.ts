import './styles/main.scss';

import { Application } from 'pixi.js';
import { pathFinding } from './path-finding';
import { TickerService } from './services';
import { createCircleFunction } from './util';
import { printCircle, printLine } from './models';

window.addEventListener('load', async () => {
  const area = document.getElementById('game') as HTMLCanvasElement;
  const game = new Application({
    view: area,
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x8822ee,
  });

  const circle = createCircleFunction({
    origin: { x: 300, y: 300 },
    r: 100,
  });
  printCircle(game, circle);

  game.ticker.add(() => {
    TickerService.tick();
  });
  let t1: any;
  let t2: any;
  TickerService.handler.add((_t) => {
    if (t1) {
      t1.remove();
      t2.remove();
    }
    const t = _t / 1000;
    const r = 110;
    const x = 300 + r * Math.cos(t);
    const y = 300 + r * Math.sin(t);
    const lines = circle.getTangentLines({ x, y });
    if (lines) {
      t1 = printLine(game, { line: lines[0] });
      t2 = printLine(game, { line: lines[1] });
    } else {
      t1 = null;
      t2 = null;
    }
  });
  // await pathFinding(game);
});
