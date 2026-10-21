export function formatSlopeCallout(slopePercent: number, precision = 1): string {
  if (!isFinite(slopePercent)) return "n/a";
  return `${slopePercent.toFixed(precision)}%`;
}

export function classifySlope(slopePercent: number): "flat" | "gentle" | "moderate" | "steep" {
  if (slopePercent < 2) return "flat";
  if (slopePercent < 5) return "gentle";
  if (slopePercent < 12) return "moderate";
  return "steep";
}

export function slopeBetweenElevations(riseMeters: number, runMeters: number): number {
  if (runMeters === 0) throw new Error("run must not be zero");
  return (riseMeters / runMeters) * 100;
}
