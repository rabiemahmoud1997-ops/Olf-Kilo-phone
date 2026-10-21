export interface ElevationGrid {
  rows: number;
  cols: number;
  cellSize: number; // meters per cell (assumes square cells)
  data: (number | null)[]; // row-major; null = NoData
  noData?: number | null;
}

export interface SlopeResult {
  rows: number;
  cols: number;
  slopePercent: (number | null)[]; // row-major
  aspectDegrees: (number | null)[]; // row-major; -1 for flat
}

function idx(r: number, c: number, cols: number): number {
  return r * cols + c;
}

export function computeSlopeAspect(grid: ElevationGrid): SlopeResult {
  const { rows, cols, cellSize, data } = grid;
  const slope = new Array<number | null>(rows * cols).fill(null);
  const aspect = new Array<number | null>(rows * cols).fill(null);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = idx(r, c, cols);
      const z = data[i];
      if (z === null || z === undefined || (grid.noData !== undefined && grid.noData !== null && z === grid.noData)) {
        slope[i] = null;
        aspect[i] = null;
        continue;
      }
      // need 3x3 neighborhood
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        slope[i] = null;
        aspect[i] = null;
        continue;
      }
      const z1 = data[idx(r - 1, c - 1, cols)];
      const z2 = data[idx(r - 1, c, cols)];
      const z3 = data[idx(r - 1, c + 1, cols)];
      const z4 = data[idx(r, c - 1, cols)];
      const z6 = data[idx(r, c + 1, cols)];
      const z7 = data[idx(r + 1, c - 1, cols)];
      const z8 = data[idx(r + 1, c, cols)];
      const z9 = data[idx(r + 1, c + 1, cols)];
      const neighbors = [z1, z2, z3, z4, z6, z7, z8, z9];
      if (neighbors.some((v) => v === null || v === undefined || (grid.noData !== undefined && grid.noData !== null && v === grid.noData))) {
        slope[i] = null;
        aspect[i] = null;
        continue;
      }
      const dzdx = ((z3 as number) + 2 * (z6 as number) + (z9 as number) - (z1 as number) - 2 * (z4 as number) - (z7 as number)) / (8 * cellSize);
      const dzdy = ((z7 as number) + 2 * (z8 as number) + (z9 as number) - (z1 as number) - 2 * (z2 as number) - (z3 as number)) / (8 * cellSize);
      const slopeRatio = Math.sqrt(dzdx * dzdx + dzdy * dzdy);
      slope[i] = slopeRatio * 100;
      if (slopeRatio === 0) {
        aspect[i] = -1; // flat
      } else {
        let a = Math.atan2(dzdy, -dzdx) * (180 / Math.PI);
        if (a < 0) a += 360;
        aspect[i] = a;
      }
    }
  }
  return { rows, cols, slopePercent: slope, aspectDegrees: aspect };
}
