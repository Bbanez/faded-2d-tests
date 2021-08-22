import { Application, Sprite } from 'pixi.js';

export const Assets: {
  nogo: Sprite;
} = {} as never;

export async function loadAssets(
  game: Application,
  assets: Array<{ name: string; path: string }>,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return await new Promise<void>((resolve) => {
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      game.loader.add(asset.name, asset.path);
    }
    if (onProgress) {
      game.loader.onProgress.add((event) => {
        onProgress(event.progress);
      });
    }
    game.loader.load((_, resources) => {
      for (const key in resources) {
        (Assets as any)[key] = Sprite.from(resources[key].data);
      }
      resolve();
    });
  });
}

export function getPixelData({
  game,
  sprite,
  color,
}: {
  game: Application;
  sprite: Sprite;
  color: 'r' | 'g' | 'b';
}): number[][] {
  const pixData: number[] = (game.renderer.plugins as any).extract.pixels(
    sprite,
  );
  let pixelPointer = color === 'r' ? 0 : color === 'g' ? 1 : 2;
  const output: number[][] = [];
  for (let row = 0; row < sprite.width; row++) {
    output.push([]);
    for (let col = 0; col < sprite.height; col++) {
      output[row].push(pixData[pixelPointer]);
      pixelPointer += 4;
    }
  }
  return output;
}
