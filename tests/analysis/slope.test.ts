import { describe, it, expect } from "vitest";
import { computeSlopeAspect } from "../../src/analysis/slope.js";

describe("slope/aspect", () => {
  it("flat plane -> 0 slope", () => {
    const grid = { rows: 3, cols: 3, cellSize: 1, data: [5, 5, 5, 5, 5, 5, 5, 5, 5] };
    const r = computeSlopeAspect(grid);
    expect(r.slopePercent[4]).toBe(0);
    expect(r.aspectDegrees[4]).toBe(-1);
  });
  it("edges null", () => {
    const grid = { rows: 3, cols: 3, cellSize: 1, data: [5, 5, 5, 5, 5, 5, 5, 5, 5] };
    const r = computeSlopeAspect(grid);
    expect(r.slopePercent[0]).toBeNull();
  });
  it("nodata propagates", () => {
    const grid = { rows: 3, cols: 3, cellSize: 1, data: [5, 5, 5, 5, null, 5, 5, 5, 5], noData: null };
    const r = computeSlopeAspect(grid);
    expect(r.slopePercent[4]).toBeNull();
  });
  it("tilted plane has nonzero slope", () => {
    // z increases to the right
    const data = [
      0, 1, 2,
      0, 1, 2,
      0, 1, 2
    ];
    const grid = { rows: 3, cols: 3, cellSize: 1, data };
    const r = computeSlopeAspect(grid);
    expect(r.slopePercent[4]).not.toBeNull();
    expect((r.slopePercent[4] as number)).toBeGreaterThan(0);
  });
});
