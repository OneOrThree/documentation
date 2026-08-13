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
