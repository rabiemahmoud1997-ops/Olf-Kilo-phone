import { describe, it, expect } from "vitest";
import { toCsv, parseCsv } from "../../src/export/csv.js";

describe("csv export", () => {
  it("round-trips simple rows", () => {
    const rows = [
      { name: "Oak", qty: 2 },
      { name: "Pine", qty: 1 }
    ];
    const csv = toCsv(rows);
    const parsed = parseCsv(csv);
    expect(parsed.length).toBe(2);
    expect(parsed[0]?.name).toBe("Oak");
    expect(parsed[0]?.qty).toBe("2");
  });
  it("handles commas in values", () => {
    const rows = [{ note: "a,b" }];
    const csv = toCsv(rows);
    expect(csv).toContain('"a,b"');
  });
  it("empty input", () => {
    expect(toCsv([])).toBe("");
  });
});
