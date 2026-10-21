import { describe, it, expect } from "vitest";
import { weightedScore, rankVariants, infeasibleCannotOutrankFeasible } from "../../src/ranking/ranking.js";

describe("ranking", () => {
  it("weighted score", () => {
    expect(weightedScore({ a: 10, b: 20 }, { a: 0.5, b: 0.5 })).toBe(15);
  });
  it("feasible outranks infeasible", () => {
    const vs = [
      { id: "x", feasible: false, metrics: {}, score: 100 },
      { id: "y", feasible: true, metrics: {}, score: 1 }
    ];
    const r = rankVariants(vs);
    expect(r[0]?.id).toBe("y");
    expect(infeasibleCannotOutrankFeasible(r)).toBe(true);
  });
  it("handles two-objective tradeoff ordering", () => {
    const vs = [
      { id: "a", feasible: true, metrics: { cost: 1, shade: 5 }, score: 3 },
      { id: "b", feasible: true, metrics: { cost: 5, shade: 1 }, score: 3 }
    ];
    const r = rankVariants(vs);
    expect(r.length).toBe(2);
  });
});
