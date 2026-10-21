export interface SiteInput {
  boundaryAssetId?: string | null;
  elevationAssetId?: string | null;
  contextAssetIds?: string[];
  crs?: string | null;
  units?: string | null;
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const SUPPORTED_UNITS = new Set(["m", "ft", "meters", "feet", "EPSG"]);

export function validateSiteInput(input: SiteInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.crs || input.crs.trim() === "") {
    errors.push("Missing CRS: site input must declare a coordinate reference system.");
  }
  if (!input.units || input.units.trim() === "") {
    errors.push("Missing units: site input must declare linear units.");
  } else if (!SUPPORTED_UNITS.has(input.units.toLowerCase())) {
    warnings.push(`Units '${input.units}' not in supported set; treat as unknown.`);
  }
  if (!input.boundaryAssetId) {
    errors.push("Missing boundary asset id.");
  }
  if (input.elevationAssetId && !input.crs) {
    errors.push("Elevation asset provided but CRS missing; cannot validate overlay.");
  }
  if (input.contextAssetIds) {
    for (const id of input.contextAssetIds) {
      if (!id || id.trim() === "") {
        errors.push("Empty context asset id.");
      }
    }
  }
  if (input.crs && input.crs.toUpperCase().startsWith("EPSG:") === false && !input.crs.includes(":")) {
    warnings.push("CRS is not in EPSG:XXXX form; verify against source metadata.");
  }

  return { ok: errors.length === 0, errors, warnings };
}
