export interface PlantPlacement {
  id: string;
  speciesId: string;
  x: number;
  y: number;
}

export interface Boundary {
  minX: number; minY: number; maxX: number; maxY: number;
}

export function validatePlacement(p: PlantPlacement, b: Boundary): boolean {
  return p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY;
}

export function validatePlacements(placements: PlantPlacement[], b: Boundary): { ok: boolean; invalidIds: string[] } {
  const invalidIds: string[] = [];
  for (const p of placements) {
    if (!validatePlacement(p, b)) invalidIds.push(p.id);
  }
  return { ok: invalidIds.length === 0, invalidIds };
}

export interface ScheduleRow {
  speciesId: string;
  quantity: number;
}

export function generatePlantSchedule(placements: PlantPlacement[]): ScheduleRow[] {
  const counts = new Map<string, number>();
  for (const p of placements) {
    counts.set(p.speciesId, (counts.get(p.speciesId) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([speciesId, quantity]) => ({ speciesId, quantity }));
}

export function generateGridPlacements(
  speciesId: string,
  boundary: Boundary,
  spacing: number,
  idPrefix = "plant"
): PlantPlacement[] {
  if (spacing <= 0) throw new Error("spacing must be > 0");
  const result: PlantPlacement[] = [];
  let i = 0;
  for (let x = boundary.minX; x <= boundary.maxX; x += spacing) {
    for (let y = boundary.minY; y <= boundary.maxY; y += spacing) {
      result.push({ id: `${idPrefix}-${i++}`, speciesId, x, y });
    }
  }
  return result;
}
