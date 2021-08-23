import { Graphics } from 'pixi.js';

export interface Animatable {
  g: Graphics;
  remove(): void;
}
