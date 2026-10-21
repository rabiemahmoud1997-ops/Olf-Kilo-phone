import { describe, it, expect } from "vitest";
import { validateDetail, generateDetailReport } from "../../src/details/details.js";

describe("details", () => {
  it("validates missing source", () => {
    expect(validateDetail({ id: "d1", title: "T", number: "1", category: "c", source: "", version: "1" })).toContain("missing source");
  });
  it("generates sorted report", () => {
    const ds = [
      { id: "d2", title: "B", number: "2", category: "c", source: "lib", version: "1" },
      { id: "d1", title: "A", number: "1", category: "c", source: "lib", version: "1" }
    ];
    const r = generateDetailReport(ds);
    expect(r[0]?.number).toBe("1");
  });
});
