import { LinearFunctions, Point } from '../types';

export function createLineFunction({
  start,
  end,
}: {
  start: Point;
  end: Point;
}): LinearFunctions {
  const k = (end.y - start.y) / (end.x - start.x);
  const n = start.y - k * start.x;

  const self: LinearFunctions = {
    k,
    n,
    originPoints: {
      start,
      end,
    },
    f(x) {
      return k * x + n;
    },
    getIntersection(line) {
      const x = (line.n - n) / (k - line.k);
      const y = k * x + n;
      return { x, y };
    },
    getParallel(point) {
      const parallelLineN = point.y - k * point.x;
      return createLineFunction({
        start: point,
        end: {
          x: point.x + 200,
          y: k * (point.x + 200) + parallelLineN,
        },
      });
    },
    getNormal(point) {
      const parallelLine = self.getParallel(point);
      const fi =
        Math.atan(
          (parallelLine.originPoints.end.y -
            parallelLine.originPoints.start.y) /
            (parallelLine.originPoints.end.x -
              parallelLine.originPoints.start.x),
        ) +
        Math.PI / 2;
      const x = point.x + 200 * Math.cos(fi);
      const y = point.y + 200 * Math.sin(fi);
      return createLineFunction({
        start: point,
        end: { x, y },
      });
    },
  };
  return self;
}
