export interface Detail {
  id: string;
  title: string;
  number: string;
  category: string;
  source: string;
  version: string;
}

export function validateDetail(d: Detail): string[] {
  const errs: string[] = [];
  if (!d.id) errs.push("missing id");
  if (!d.title) errs.push("missing title");
  if (!d.number) errs.push("missing number");
  if (!d.source) errs.push("missing source");
  if (!d.version) errs.push("missing version");
  return errs;
}

export function generateDetailReport(details: Detail[]): { number: string; title: string; category: string; source: string; version: string }[] {
  return details
    .slice()
    .sort((a, b) => a.number.localeCompare(b.number))
    .map((d) => ({ number: d.number, title: d.title, category: d.category, source: d.source, version: d.version }));
}
