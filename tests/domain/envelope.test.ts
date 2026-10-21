import { describe, it, expect } from "vitest";
import { wrap, unwrap, migrateProject, CURRENT_SCHEMA_VERSION } from "../../src/domain/envelope.js";
import { newId } from "../../src/domain/id.js";

describe("domain envelope", () => {
  it("wraps with current version", () => {
    const e = wrap({ name: "p" });
    expect(e.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(e.payload).toEqual({ name: "p" });
  });
  it("unwraps versioned", () => {
    const e = wrap({ name: "p" });
    const r = unwrap<{ name: string }>(e);
    expect(r.version).toBe(CURRENT_SCHEMA_VERSION);
    expect(r.payload.name).toBe("p");
  });
  it("treats unversioned as v0", () => {
    const r = unwrap<{ name: string }>({ name: "p" });
    expect(r.version).toBe(0);
    expect(r.payload.name).toBe("p");
  });
});

describe("migration v0->v1", () => {
  it("migrates legacy project and adds defaults", () => {
    const legacy = { id: "p1", name: "old" };
    const res = migrateProject(legacy);
    expect(res.migrated).toBe(true);
    expect(res.version).toBe(CURRENT_SCHEMA_VERSION);
    const env = res.payload as { schemaVersion: number; payload: Record<string, unknown> };
    expect(env.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(env.payload.siteIds).toEqual([]);
    expect(env.payload.catalogIds).toEqual([]);
    expect(env.payload.variantIds).toEqual([]);
  });
  it("does not migrate already current", () => {
    const cur = wrap({ id: "p2", name: "new", siteIds: [], catalogIds: [], variantIds: [] });
    const res = migrateProject(cur);
    expect(res.migrated).toBe(false);
  });
});

describe("stable ids", () => {
  it("generates prefixed unique ids", () => {
    const a = newId("proj");
    const b = newId("proj");
    expect(a).not.toBe(b);
    expect(a.startsWith("proj-")).toBe(true);
  });
});
