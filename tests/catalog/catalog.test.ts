import { describe, it, expect } from "vitest";
import {
  createCatalog,
  addItem,
  validateCatalog,
  serializeCatalog,
  parseCatalog
} from "../../src/catalog/catalog.js";

describe("catalog adapter", () => {
  it("create + add + serialize roundtrip", () => {
    const cat = createCatalog("p1", "Plants");
    const item = addItem(cat, { name: "Oak", category: "tree", attributes: { height: 10 } });
    expect(item.id.startsWith("item-")).toBe(true);
    const raw = serializeCatalog(cat);
    const parsed = parseCatalog(raw);
    expect(parsed.items.length).toBe(1);
    expect(parsed.items[0]?.name).toBe("Oak");
  });
  it("validation catches missing name", () => {
    const cat = createCatalog("p1", "Plants");
    addItem(cat, { name: "", category: "tree", attributes: {} });
    const v = validateCatalog(cat);
    expect(v.ok).toBe(false);
  });
  it("validation catches duplicate ids", () => {
    const cat = createCatalog("p1", "Plants");
    addItem(cat, { id: "x", name: "A", category: "tree", attributes: {} });
    addItem(cat, { id: "x", name: "B", category: "tree", attributes: {} });
    const v = validateCatalog(cat);
    expect(v.ok).toBe(false);
  });
  it("parse rejects invalid", () => {
    expect(() => parseCatalog(JSON.stringify({ id: "c", projectId: "p", name: "X", items: [{ id: "i", name: "", category: "t", attributes: {} }] }))).toThrow();
  });
});
