export type OlfId = string;

export interface Provenance {
  sourceIds: string[];
  algorithmVersion: string;
  inputHash: string;
  parameters: Record<string, unknown>;
  createdAt: string;
  warnings: string[];
}

export interface Project {
  id: OlfId;
  name: string;
  crs: string | null;
  units: string | null;
  siteIds: OlfId[];
  catalogIds: OlfId[];
  variantIds: OlfId[];
  schemaVersion: number;
  provenance?: Provenance;
}

export interface Site {
  id: OlfId;
  projectId: OlfId;
  boundaryAssetId: string | null;
  elevationAssetId: string | null;
  contextAssetIds: string[];
}

export interface AssetCatalog {
  id: OlfId;
  projectId: OlfId;
  name: string;
  items: CatalogItem[];
}

export interface CatalogItem {
  id: OlfId;
  name: string;
  category: string;
  attributes: Record<string, unknown>;
}

export interface DesignObject {
  id: OlfId;
  projectId: OlfId;
  siteId: OlfId | null;
  kind: string;
  geometry: unknown;
  crs: string | null;
  units: string | null;
  provenance?: Provenance;
}

export interface Constraint {
  id: OlfId;
  projectId: OlfId;
  type: string;
  severity: "hard" | "soft";
  parameters: Record<string, unknown>;
}

export interface AnalysisRun {
  id: OlfId;
  projectId: OlfId;
  operation: string;
  inputHash: string;
  algorithmVersion: string;
  parameters: Record<string, unknown>;
  sourceIds: string[];
  status: "completed" | "completed_with_warnings" | "failed";
  warnings: string[];
  createdAt: string;
}

export interface Variant {
  id: OlfId;
  projectId: OlfId;
  parentVariantId: OlfId | null;
  seed: number | null;
  algorithmVersion: string;
  status: "draft" | "accepted" | "rejected";
  constraintResults: { constraintId: OlfId; passed: boolean; violation?: string }[];
  metricIds: OlfId[];
}

export interface Metric {
  id: OlfId;
  variantId: OlfId;
  name: string;
  value: number | null;
  units: string;
  formula: string;
  sourceIds: string[];
  confidence: "measured" | "estimated" | "unknown";
}

export interface Schedule {
  id: OlfId;
  projectId: OlfId;
  kind: string;
  rows: Record<string, unknown>[];
}

export interface ExportJob {
  id: OlfId;
  projectId: OlfId;
  format: string;
  status: "pending" | "completed" | "failed";
  warnings: string[];
}

export const CURRENT_SCHEMA_VERSION = 1;
