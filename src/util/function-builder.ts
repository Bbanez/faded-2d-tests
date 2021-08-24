import { CircleFunctions, LinearFunctions, Point } from '../types';

export function createLineFunctionFromParams({
  k,
  n,
}: {
  k: number;
  n: number;
}): LinearFunctions {
  const y1 = k * 0 + n;
  const y2 = k * 100 + n;
  return createLineFunction({
    start: { x: 0, y: y1 },
    end: { x: 100, y: y2 },
    k,
    n,
  });
}

export function createLineFunction({
  start,
  end,
  k,
  n,
}: {
  start: Point;
  end: Point;
  k?: number;
  n?: number;
}): LinearFunctions {
  if (!k || !n) {
    k = (end.y - start.y) / (end.x - start.x);
    n = start.y - k * start.x;
  }

  const self: LinearFunctions = {
    k,
    n,
    originPoints: {
      start,
      end,
    },
    f(x) {
      return self.k * x + self.n;
    },
    getIntersection(line) {
      const x = (line.n - self.n) / (self.k - line.k);
      const y = self.k * x + self.n;
      return { x, y };
    },
    getParallel(point) {
      const parallelLineN = point.y - self.k * point.x;
      return createLineFunction({
        start: point,
        end: {
          x: point.x + 200,
          y: self.k * (point.x + 200) + parallelLineN,
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

export function createCircleFunction({
  origin,
  r,
}: {
  origin: Point;
  r: number;
}): CircleFunctions {
  const self: CircleFunctions = {
    origin,
    r,
    f(x) {
      const a = origin.x;
      const b = origin.y;
      const C = b * b + (x - a) * (x - a) - r * r;
      if (C > 0) {
        const sqrt = Math.sqrt(2 * 2 * b * b - 4 * C);
        const y1 = (2 * b + sqrt) / 2;
        const y2 = (2 * b - sqrt) / 2;
        return [y1, y2];
      }
      return null;
    },
    getIntersectionsWithCircle() {
      return null;
    },
    getIntersectionsWithLine(line) {
      const a = origin.x;
      const b = origin.y;
      const c = line.n - b;
      const A = 1 + line.k * line.k;
      const B = 2 * line.k * c - 2 * a;
      const C = a * a + c * c - r * r;
      const sqrt = Math.sqrt(B * B - 4 * A * C);
      if (sqrt > 0) {
        const x1 = (-B + sqrt) / (2 * A);
        const x2 = (-B - sqrt) / (2 * A);

        return [
          { x: x1, y: line.f(x1) },
          { x: x2, y: line.f(x2) },
        ];
      }
      return null;
    },
    getTangentLines(point) {
      if (point.x === origin.x + r || point.x === origin.x - r) {
        point.x += 0.00001;
      }
      if (point.y === origin.y + r || point.y === origin.y - r) {
        point.y += 0.00001;
      }
      if (self.isOutside(point)) {
        const s1 =
          r *
          Math.sqrt(
            origin.x * origin.x -
              2 * origin.x * point.x +
              point.x * point.x +
              origin.y * origin.y -
              2 * origin.y * point.y +
              point.y * point.y -
              r * r,
          );
        const s4 =
          -(origin.x * origin.x) +
          2 * origin.x * point.x -
          point.x * point.x +
          r * r;
        const k1 =
          (origin.x * point.y -
            origin.x * origin.y +
            point.x * origin.y -
            point.x * point.y +
            s1) /
          s4;
        const k2 =
          -(
            origin.x * origin.y -
            origin.x * point.y -
            point.x * origin.y +
            point.x * point.y +
            s1
          ) / s4;
        const k = [k1, k2];
        const n1 = point.y - k1 * point.x;
        const n2 = point.y - k2 * point.x;
        const n = [n1, n2];
        const points: Point[] = [];
        for (let i = 0; i < 2; i++) {
          let hs1 = Math.sqrt(
            k[i] * k[i] * r * r -
              k[i] * k[i] * origin.x * origin.x -
              2 * k[i] * n[i] * origin.x +
              2 * k[i] * origin.x * origin.y -
              n[i] * n[i] +
              2 * n[i] * origin.y +
              r * r -
              origin.y * origin.y,
          );
          if (isNaN(hs1)) {
            hs1 = 0;
          }
          const x =
            (origin.x + k[i] * origin.y + hs1 - k[i] * n[i]) /
            (k[i] * k[i] + 1);
          const y = k[i] * x + n[i];
          points.push({ x, y });
        }
        return [
          createLineFunction({ start: point, end: points[0] }),
          createLineFunction({ start: point, end: points[1] }),
        ];
        // const centerLine = createLineFunction({ start: point, end: origin });
        // const circleNormal = centerLine.getNormal(origin);
        // const normalInter = self.getIntersectionsWithLine(circleNormal);
        // if (normalInter) {
        //   const helpLine1 = createLineFunction({
        //     start: point,
        //     end: normalInter[0],
        //   });
        //   const help1Normal = helpLine1.getNormal(origin);
        //   const tPoint1 = self.getIntersectionsWithLine(help1Normal);
        //   if (tPoint1) {
        //     const helpLine2 = circleNormal.getParallel(tPoint1[0]);
        //     const tPoints = self.getIntersectionsWithLine(helpLine2);
        //     if (tPoints) {
        //       const tLine1 = createLineFunction({
        //         start: point,
        //         end: tPoints[0],
        //       });
        //       const tLine2 = createLineFunction({
        //         start: point,
        //         end: tPoints[1],
        //       });
        //       return [tLine1, tLine2];
        //     }
        //   }
        // }
      }
      return null;
    },
    isConcentric(circle) {
      return circle.origin.x === origin.x && circle.origin.y === origin.y;
    },
    isInside(point) {
      const x = origin.x - point.x;
      const y = origin.y - point.y;
      const d = Math.sqrt(x * x + y * y);
      return d <= r;
    },
    isOutside(point) {
      const x = origin.x - point.x;
      const y = origin.y - point.y;
      const d = Math.sqrt(x * x + y * y);
      return d > r;
    },
  };
  return self;
}
