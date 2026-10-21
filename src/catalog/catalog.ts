import { newId } from "../domain/id.js";
import type { AssetCatalog, CatalogItem } from "../domain/types.js";

export interface CatalogValidation {
  ok: boolean;
  errors: string[];
}

export function validateCatalog(catalog: AssetCatalog): CatalogValidation {
  const errors: string[] = [];
  if (!catalog.id) errors.push("Catalog missing id.");
  if (!catalog.projectId) errors.push("Catalog missing projectId.");
  if (!catalog.name || catalog.name.trim() === "") errors.push("Catalog missing name.");
  const ids = new Set<string>();
  for (const item of catalog.items) {
    if (!item.id) errors.push("Catalog item missing id.");
    if (ids.has(item.id)) errors.push(`Duplicate item id: ${item.id}`);
    ids.add(item.id);
    if (!item.name || item.name.trim() === "") errors.push(`Item ${item.id} missing name.`);
    if (!item.category || item.category.trim() === "") errors.push(`Item ${item.id} missing category.`);
  }
  return { ok: errors.length === 0, errors };
}

export function createCatalog(projectId: string, name: string): AssetCatalog {
  return { id: newId("cat"), projectId, name, items: [] };
}

export function addItem(catalog: AssetCatalog, item: Omit<CatalogItem, "id"> & { id?: string }): CatalogItem {
  const ci: CatalogItem = {
    id: item.id ?? newId("item"),
    name: item.name,
    category: item.category,
    attributes: item.attributes ?? {}
  };
  catalog.items.push(ci);
  return ci;
}

export function serializeCatalog(catalog: AssetCatalog): string {
  return JSON.stringify(catalog, null, 2);
}

export function parseCatalog(raw: string): AssetCatalog {
  const parsed = JSON.parse(raw) as AssetCatalog;
  const v = validateCatalog(parsed);
  if (!v.ok) throw new Error(v.errors.join("; "));
  return parsed;
}
