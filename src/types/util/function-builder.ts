import { Point } from '../point';

export interface CircleFunctions {
  origin: Point;
  r: number;
  getTangentLines(point: Point): LinearFunctions[] | null;
  f(x: number): [number, number] | null;
  getIntersectionsWithLine(line: LinearFunctions): [Point, Point] | null;
  getIntersectionsWithCircle(circle: CircleFunctions): [Point, Point] | null;
  /**
   * Will check if passed circle concentric.
   */
  isConcentric(circle: CircleFunctions): boolean;
  /**
   * Will check if passed circle is inside.
   */
  isInside(point: Point): boolean;
  /**
   * Will check if passed circle is outside.
   */
  isOutside(point: Point): boolean;
}

export interface LinearFunctions {
  originPoints: {
    start: Point;
    end: Point;
  };
  k: number;
  n: number;
  f(x: number): number;
  getIntersection(line: LinearFunctions): Point;
  getNormal(point: Point): LinearFunctions;
  getParallel(point: Point): LinearFunctions;
}
