import './styles/main.scss';

import { Application } from 'pixi.js';
import { pathFinding } from './path-finding';
import { TickerService } from './services';

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

  await pathFinding(game);
});
