import { Point } from '../../types';

export interface Path {
  from: Point;
  to: Point;
  fn(point: Point): { angle: number };
}
