import { describe, it, expect } from "vitest";
import {
  generateGridPlacements,
  validatePlacements,
  generatePlantSchedule
} from "../../src/planting/planting.js";

describe("planting", () => {
  const b = { minX: 0, minY: 0, maxX: 4, maxY: 4 };
  it("generates grid placements within boundary", () => {
    const ps = generateGridPlacements("oak", b, 2);
    expect(ps.length).toBeGreaterThan(0);
    const v = validatePlacements(ps, b);
    expect(v.ok).toBe(true);
  });
  it("rejects invalid spacing", () => {
    expect(() => generateGridPlacements("oak", b, 0)).toThrow();
  });
  it("schedule counts by species", () => {
    const ps = [
      { id: "a", speciesId: "oak", x: 0, y: 0 },
      { id: "b", speciesId: "oak", x: 1, y: 1 },
      { id: "c", speciesId: "pine", x: 2, y: 2 }
    ];
    const s = generatePlantSchedule(ps);
    expect(s.find((r) => r.speciesId === "oak")?.quantity).toBe(2);
    expect(s.find((r) => r.speciesId === "pine")?.quantity).toBe(1);
  });
  it("detects out-of-boundary placement", () => {
    const ps = [{ id: "x", speciesId: "oak", x: 10, y: 10 }];
    const v = validatePlacements(ps, b);
    expect(v.ok).toBe(false);
    expect(v.invalidIds).toContain("x");
  });
});
