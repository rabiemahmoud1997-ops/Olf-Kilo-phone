import { describe, it, expect } from "vitest";
import { validateNetwork } from "../../src/irrigation/network.js";

describe("irrigation network", () => {
  it("validates connected network", () => {
    const net = {
      nodes: [
        { id: "s", kind: "source" as const, pressureKpa: 300, flowLps: 2 },
        { id: "h", kind: "head" as const }
      ],
      edges: [{ from: "s", to: "h", lengthM: 5, diameterMm: 25 }]
    };
    const r = validateNetwork(net);
    expect(r.ok).toBe(true);
    expect(r.warnings).toEqual([]);
  });
  it("errors on missing source", () => {
    const net = { nodes: [{ id: "h", kind: "head" as const }], edges: [] };
    const r = validateNetwork(net);
    expect(r.ok).toBe(false);
  });
  it("errors on disconnected node", () => {
    const net = {
      nodes: [
        { id: "s", kind: "source" as const, pressureKpa: 300, flowLps: 2 },
        { id: "h", kind: "head" as const }
      ],
      edges: []
    };
    const r = validateNetwork(net);
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.includes("connected"))).toBe(true);
  });
  it("warns on unsized pipe and missing source data", () => {
    const net = {
      nodes: [{ id: "s", kind: "source" as const }],
      edges: [{ from: "s", to: "s", lengthM: 1 }]
    };
    const r = validateNetwork(net);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
