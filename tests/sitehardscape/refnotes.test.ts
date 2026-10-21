import { describe, it, expect } from "vitest";
import { validateRefNote, generateRefNoteSchedule, totalQuantity } from "../../src/sitehardscape/refnotes.js";

describe("refnotes", () => {
  it("validates missing fields", () => {
    expect(validateRefNote({ id: "r1", name: "", category: "paving", quantity: 1, unit: "m2" })).toContain("missing name");
  });
  it("rejects negative quantity", () => {
    expect(validateRefNote({ id: "r1", name: "Bench", category: "furniture", quantity: -1, unit: "ea" })).toContain("negative quantity");
  });
  it("generates schedule", () => {
    const notes = [{ id: "r1", name: "Bench", category: "furniture", quantity: 2, unit: "ea" }];
    const s = generateRefNoteSchedule(notes);
    expect(s[0]?.quantity).toBe(2);
  });
  it("totals by category", () => {
    const notes = [
      { id: "a", name: "Bench", category: "furniture", quantity: 2, unit: "ea" },
      { id: "b", name: "Paver", category: "paving", quantity: 10, unit: "m2" }
    ];
    expect(totalQuantity(notes, "furniture")).toBe(2);
    expect(totalQuantity(notes)).toBe(12);
  });
});
