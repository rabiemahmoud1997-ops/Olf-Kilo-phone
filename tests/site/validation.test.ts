import { describe, it, expect } from "vitest";
import { validateSiteInput } from "../../src/site/validation.js";

describe("site input validation", () => {
  it("accepts valid input", () => {
    const r = validateSiteInput({
      boundaryAssetId: "b1",
      crs: "EPSG:4326",
      units: "m",
      elevationAssetId: "dem1",
      contextAssetIds: ["roads"]
    });
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });
  it("rejects missing CRS", () => {
    const r = validateSiteInput({ boundaryAssetId: "b1", crs: null, units: "m" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("CRS"))).toBe(true);
  });
  it("rejects missing units", () => {
    const r = validateSiteInput({ boundaryAssetId: "b1", crs: "EPSG:4326", units: null });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("units"))).toBe(true);
  });
  it("rejects missing boundary", () => {
    const r = validateSiteInput({ crs: "EPSG:4326", units: "m" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("boundary"))).toBe(true);
  });
  it("warns on unknown units", () => {
    const r = validateSiteInput({ boundaryAssetId: "b1", crs: "EPSG:4326", units: "cubits" });
    expect(r.ok).toBe(true);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
