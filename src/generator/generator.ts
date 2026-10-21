export interface Zone {
  id: string;
  areaM2: number;
  eligible: boolean;
}

export interface Allocation {
  zoneId: string;
  coverType: string;
}

// deterministic pseudo-random (mulberry32)
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function allocateCovers(
  zones: Zone[],
  coverTypes: string[],
  seed: number
): Allocation[] {
  const r = rng(seed);
  const result: Allocation[] = [];
  for (const z of zones) {
    if (!z.eligible) {
      result.push({ zoneId: z.id, coverType: "excluded" });
      continue;
    }
    const idx = Math.floor(r() * coverTypes.length);
    const chosen = coverTypes[idx] ?? coverTypes[0] ?? "unknown";
    result.push({ zoneId: z.id, coverType: chosen });
  }
  return result;
}

export function isDeterministic(zones: Zone[], coverTypes: string[], seed: number): boolean {
  const a = allocateCovers(zones, coverTypes, seed);
  const b = allocateCovers(zones, coverTypes, seed);
  return JSON.stringify(a) === JSON.stringify(b);
}
