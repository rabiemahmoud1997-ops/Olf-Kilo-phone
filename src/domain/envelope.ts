import { CURRENT_SCHEMA_VERSION } from "./types.js";

export interface Envelope<T> {
  schemaVersion: number;
  payload: T;
}

export function wrap<T>(payload: T, version = CURRENT_SCHEMA_VERSION): Envelope<T> {
  return { schemaVersion: version, payload };
}

export function unwrap<T>(raw: unknown): { version: number; payload: T } {
  if (raw && typeof raw === "object" && "schemaVersion" in (raw as object) && "payload" in (raw as object)) {
    const r = raw as { schemaVersion: number; payload: T };
    return { version: r.schemaVersion, payload: r.payload };
  }
  // legacy unversioned (v0)
  return { version: 0, payload: raw as T };
}

export function migrateProject(raw: unknown): { version: number; migrated: boolean; payload: unknown } {
  const { version, payload } = unwrap<Record<string, unknown>>(raw);
  if (version >= CURRENT_SCHEMA_VERSION) {
    return { version, migrated: false, payload };
  }
  // v0 -> v1: ensure schemaVersion and defaults
  const p = { ...(payload ?? {}) } as Record<string, unknown>;
  if (!Array.isArray(p.siteIds)) p.siteIds = [];
  if (!Array.isArray(p.catalogIds)) p.catalogIds = [];
  if (!Array.isArray(p.variantIds)) p.variantIds = [];
  if (typeof p.schemaVersion !== "number") p.schemaVersion = CURRENT_SCHEMA_VERSION;
  return { version: CURRENT_SCHEMA_VERSION, migrated: true, payload: wrap(p, CURRENT_SCHEMA_VERSION) };
}

export { CURRENT_SCHEMA_VERSION } from "./types.js";
