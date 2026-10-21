import { describe, it, expect } from "vitest";
import { formatSlopeCallout, classifySlope, slopeBetweenElevations } from "../../src/grading/grading.js";

describe("grading", () => {
  it("formats slope", () => {
    expect(formatSlopeCallout(5.234)).toBe("5.2%");
  });
  it("classifies", () => {
    expect(classifySlope(1)).toBe("flat");
    expect(classifySlope(3)).toBe("gentle");
    expect(classifySlope(8)).toBe("moderate");
    expect(classifySlope(15)).toBe("steep");
  });
  it("computes slope from elevations", () => {
    expect(slopeBetweenElevations(1, 10)).toBeCloseTo(10);
  });
  it("throws on zero run", () => {
    expect(() => slopeBetweenElevations(1, 0)).toThrow();
  });
});
