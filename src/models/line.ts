import { Application, Graphics } from 'pixi.js';
import { Line, LinearFunctions, LineConfig } from '../types';
import { createCircle } from './circle';

export function createLine(
  game: Application,
  { width, start, end, color }: LineConfig,
): Line {
  const graphics = new Graphics();
  graphics.lineStyle(width ? width : 1, color ? color : 0x000000);
  graphics.moveTo(start.x, start.y);
  graphics.lineTo(end.x, end.y);
  game.stage.addChild(graphics);

  return {
    g: graphics,
    remove() {
      graphics.destroy();
      game.stage.removeChild(graphics);
    },
  };
}

export function printLine(
  game: Application,
  { line }: { line: LinearFunctions },
): { remove(): void } {
  const line1 = createLine(game, { ...line.originPoints });
  const circle1 = createCircle(game, {
    position: line.originPoints.start,
    color: 0x000099,
    size: 3,
  });
  const circle2 = createCircle(game, {
    position: line.originPoints.end,
    color: 0x0000ff,
    size: 3,
  });

  return {
    remove() {
      line1.remove();
      circle1.remove();
      circle2.remove();
    },
  };
}
