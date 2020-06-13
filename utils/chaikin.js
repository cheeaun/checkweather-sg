// 1. https://observablehq.com/@dvreed77/chaikin
// 2. https://www.npmjs.com/package/chaikin
function cut(start, end, ratio) {
  const r1 = [
    start[0] * (1 - ratio) + end[0] * ratio,
    start[1] * (1 - ratio) + end[1] * ratio,
  ];
  const r2 = [
    start[0] * ratio + end[0] * (1 - ratio),
    start[1] * ratio + end[1] * (1 - ratio),
  ];
  return [r1, r2];
}
function chaikin(pts, iterations = 1, closed = true, ratio = 0.25) {
  if (iterations > 10) iterations = 10;
  if (iterations == 0) return pts;

  if (closed) {
    const nCorners = pts.length;

    const newPts = [];
    for (let i = 0; i < nCorners; i++) {
      const ptA = pts[i];
      const ptB = pts[(i + 1) % nCorners];

      const [newPtA, newPtB] = cut(ptA, ptB, ratio);

      newPts.push(newPtA, newPtB);
    }

    return chaikin(newPts, iterations - 1, closed, ratio);
  } else {
    if (ratio > 0.5) {
      ratio = 1 - ratio;
    }

    for (let i = 0; i < iterations; i++) {
      let refined = [];
      refined.push(pts[0]);

      for (let j = 1; j < pts.length; j++) {
        let points = cut(pts[j - 1], pts[j], ratio);
        refined = refined.concat(points);
      }

      if (closed) {
        refined = refined.concat(cut(pts[pts.length - 1], pts[0], ratio));
      } else {
        refined.push(pts[pts.length - 1]);
      }

      pts = refined;
    }
    return pts;
  }
}

export default chaikin;
