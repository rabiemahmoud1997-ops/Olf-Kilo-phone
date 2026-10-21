export interface IrrigationNode {
  id: string;
  kind: "source" | "valve" | "head" | "junction";
  pressureKpa?: number | null;
  flowLps?: number | null;
}

export interface IrrigationEdge {
  from: string;
  to: string;
  lengthM: number;
  diameterMm?: number | null;
}

export interface IrrigationNetwork {
  nodes: IrrigationNode[];
  edges: IrrigationEdge[];
}

export interface NetworkValidation {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateNetwork(net: IrrigationNetwork): NetworkValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nodeIds = new Set(net.nodes.map((n) => n.id));
  if (!net.nodes.some((n) => n.kind === "source")) errors.push("No water source node.");
  for (const e of net.edges) {
    if (!nodeIds.has(e.from)) errors.push(`Edge references unknown node: ${e.from}`);
    if (!nodeIds.has(e.to)) errors.push(`Edge references unknown node: ${e.to}`);
    if (e.lengthM <= 0) errors.push(`Edge ${e.from}->${e.to} has non-positive length.`);
    if (e.diameterMm == null) warnings.push(`Edge ${e.from}->${e.to} has no diameter (unsized).`);
  }
  for (const n of net.nodes) {
    if (n.kind === "source" && (n.pressureKpa == null || n.flowLps == null)) {
      warnings.push(`Source ${n.id} missing pressure/flow data.`);
    }
  }
  // connectivity: every non-source node reachable from a source via edges
  const adj = new Map<string, string[]>();
  for (const n of net.nodes) adj.set(n.id, []);
  for (const e of net.edges) adj.get(e.from)?.push(e.to);
  const visited = new Set<string>();
  const sources = net.nodes.filter((n) => n.kind === "source").map((n) => n.id);
  const stack = [...sources];
  while (stack.length) {
    const cur = stack.pop() as string;
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const nb of adj.get(cur) ?? []) if (!visited.has(nb)) stack.push(nb);
  }
  for (const n of net.nodes) {
    if (n.kind !== "source" && !visited.has(n.id)) errors.push(`Node ${n.id} not connected to a source.`);
  }
  return { ok: errors.length === 0, errors, warnings };
}
