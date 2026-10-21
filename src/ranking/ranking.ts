export interface ScoredVariant {
  id: string;
  feasible: boolean;
  metrics: Record<string, number>;
  score: number;
}

export function weightedScore(metrics: Record<string, number>, weights: Record<string, number>): number {
  let s = 0;
  let wsum = 0;
  for (const k of Object.keys(weights)) {
    const w = weights[k] ?? 0;
    const v = metrics[k] ?? 0;
    s += w * v;
    wsum += w;
  }
  if (wsum === 0) return 0;
  return s / wsum;
}

export function rankVariants(variants: ScoredVariant[]): ScoredVariant[] {
  // feasible first (by score desc), then infeasible (by score desc)
  const feasible = variants.filter((v) => v.feasible).sort((a, b) => b.score - a.score);
  const infeasible = variants.filter((v) => !v.feasible).sort((a, b) => b.score - a.score);
  return [...feasible, ...infeasible];
}

export function infeasibleCannotOutrankFeasible(ranked: ScoredVariant[]): boolean {
  // no infeasible appears before a feasible
  let seenInfeasible = false;
  for (const v of ranked) {
    if (!v.feasible) seenInfeasible = true;
    else if (seenInfeasible) return false;
  }
  return true;
}
