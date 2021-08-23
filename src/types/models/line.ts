import { Animatable } from '../animatable';
import { Point } from '../point';

export interface LineConfig {
  start: Point;
  end: Point;
  width?: number;
  color?: number;
}

export type Line = Animatable;
