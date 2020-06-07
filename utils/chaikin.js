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
function chaikin(pts, iterations = 1, ratio = 0.25) {
  if (iterations > 10) iterations = 10;
  if (iterations == 0) return pts;

  const nCorners = pts.length;

  const newPts = [];
  for (let i = 0; i < nCorners; i++) {
    const ptA = pts[i];
    const ptB = pts[(i + 1) % nCorners];

    const [newPtA, newPtB] = cut(ptA, ptB, ratio);

    newPts.push(newPtA, newPtB);
  }

  return chaikin(newPts, ratio, iterations - 1);
}

export default chaikin;
