import { describe, it, expect } from "vitest";
import { allocateCovers, isDeterministic } from "../../src/generator/generator.js";

describe("generator", () => {
  const zones = [
    { id: "z1", areaM2: 10, eligible: true },
    { id: "z2", areaM2: 5, eligible: false }
  ];
  it("excludes ineligible zones", () => {
    const a = allocateCovers(zones, ["grass", "paver"], 1);
    expect(a.find((x) => x.zoneId === "z2")?.coverType).toBe("excluded");
  });
  it("deterministic with same seed", () => {
    expect(isDeterministic(zones, ["grass", "paver"], 42)).toBe(true);
  });
  it("different seeds may differ", () => {
    const a = allocateCovers(zones, ["grass", "paver"], 1);
    const b = allocateCovers(zones, ["grass", "paver"], 2);
    // at least possible; check structure
    expect(a.length).toBe(2);
    expect(b.length).toBe(2);
  });
});
