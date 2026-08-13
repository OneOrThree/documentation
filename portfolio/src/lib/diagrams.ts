import fs from "node:fs";
import path from "node:path";

/**
 * Diagrams are described by `diagrams/manifest.json` and compiled into
 * `public/diagrams/index.json` by `scripts/build-diagrams.mjs`, which also
 * records how many cells each one has. Reading the compiled index rather than
 * the manifest means a page can never reference a diagram that failed to build.
 */

export interface DiagramEntry {
  id: string;
  title: string;
  /** Monospace uppercase label beside the Korean title, as both clones had. */
  titleEn?: string;
  summary?: string;
  nodeCount: number;
  edgeCount: number;
}

const INDEX_PATH = path.join(process.cwd(), "public", "diagrams", "index.json");

let cached: DiagramEntry[] | undefined;

export function getDiagrams(): DiagramEntry[] {
  if (cached) return cached;
  cached = fs.existsSync(INDEX_PATH)
    ? (JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")) as DiagramEntry[])
    : [];
  return cached;
}

export function getDiagram(id: string): DiagramEntry | undefined {
  return getDiagrams().find((d) => d.id === id);
}

export interface DiagramGraph {
  id: string;
  nodes: { id: string; label: string }[];
  edges: { id: string; label: string; source: string | null; target: string | null }[];
  adjacency: Record<string, { nodes: string[]; edges: string[] }>;
}

/**
 * Read the compiled graph at build time so both views get it as a prop — the
 * text view then renders on the server and works without JavaScript, which is
 * the point of offering it.
 */
export function getDiagramGraph(id: string): DiagramGraph | undefined {
  const file = path.join(process.cwd(), "public", "diagrams", `${id}.graph.json`);
  if (!fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf8")) as DiagramGraph;
}
