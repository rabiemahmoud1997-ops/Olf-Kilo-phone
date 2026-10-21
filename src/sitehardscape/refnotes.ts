export interface RefNote {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

export function validateRefNote(n: RefNote): string[] {
  const errs: string[] = [];
  if (!n.id) errs.push("missing id");
  if (!n.name) errs.push("missing name");
  if (n.quantity < 0) errs.push("negative quantity");
  if (!n.unit) errs.push("missing unit");
  return errs;
}

export function generateRefNoteSchedule(notes: RefNote[]): { name: string; category: string; quantity: number; unit: string }[] {
  return notes.map((n) => ({
    name: n.name,
    category: n.category,
    quantity: n.quantity,
    unit: n.unit
  }));
}

export function totalQuantity(notes: RefNote[], category?: string): number {
  return notes
    .filter((n) => !category || n.category === category)
    .reduce((s, n) => s + n.quantity, 0);
}
