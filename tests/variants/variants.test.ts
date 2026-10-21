import { describe, it, expect } from "vitest";
import { evaluateConstraints, hasHardViolation, isFeasible } from "../../src/variants/variants.js";

describe("variants constraints", () => {
  it("separates hard and soft", () => {
    const cs = [
      { id: "h1", severity: "hard" as const, predicate: () => false, violationMessage: "boundary" },
      { id: "s1", severity: "soft" as const, predicate: () => false, violationMessage: "shade" }
    ];
    const ev = evaluateConstraints(cs);
    expect(hasHardViolation(ev)).toBe(true);
    expect(isFeasible(ev)).toBe(false);
  });
  it("feasible when all hard pass", () => {
    const cs = [
      { id: "h1", severity: "hard" as const, predicate: () => true, violationMessage: "boundary" },
      { id: "s1", severity: "soft" as const, predicate: () => false, violationMessage: "shade" }
    ];
    const ev = evaluateConstraints(cs);
    expect(isFeasible(ev)).toBe(true);
    expect(ev.find((e) => e.constraintId === "s1")?.passed).toBe(false);
  });
});
