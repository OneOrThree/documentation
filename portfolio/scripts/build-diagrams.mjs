#!/usr/bin/env node
/**
 * Turn a draw.io export pair into an interactive diagram.
 *
 * Why this step exists
 * --------------------
 * draw.io's SVG export keeps a `data-cell-id` on every cell group — including
 * the mxGraph root cells "0" and "1" — but it does NOT record which cells an
 * edge connects. Verified against the two cloned sites:
 *
 *   FillMap /diagrams/0   stock draw.io export → 104 × data-cell-id, 0 × source/target
 *   PokeClip /diagrams/1  custom maxGraph render → 127 edges carrying
 *                         data-cell-source / data-cell-target, and that is
 *                         exactly why its click-to-highlight was possible.
 *
 * Connectivity lives only in the .drawio XML (`<mxCell edge="1" source= target=>`).
 * So we read the graph from the XML and stamp it onto the SVG, joining on
 * data-cell-id ↔ mxCell/@id. The result is the PokeClip schema, produced from
 * an ordinary draw.io file.
 *
 * Input   diagrams/manifest.json
 *         diagrams/<id>.drawio.xml   (File → Save as / download)
 *         diagrams/<id>.svg          (File → Export as → SVG)
 * Output  public/diagrams/<id>.svg         annotated, responsive
 *         public/diagrams/<id>.graph.json  { nodes, edges, adjacency }
 *         public/diagrams/<id>.drawio.xml  copied for the "원본 ↓" link
 *         public/diagrams/index.json       manifest + per-diagram cell counts
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { XMLParser } from "fast-xml-parser";

const ROOT = path.join(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "diagrams");
const OUT_DIR = path.join(ROOT, "public", "diagrams");

/** mxGraph always seeds the model with these two; they are not real cells. */
const ROOT_CELL_IDS = new Set(["0", "1"]);

class DiagramError extends Error {}

function main() {
  const manifestPath = path.join(SRC_DIR, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.log("[diagrams] no diagrams/manifest.json — nothing to build.");
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest)) {
    throw new DiagramError("diagrams/manifest.json must be an array.");
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const index = manifest.map((entry, i) => build(entry, i));

  fs.writeFileSync(
    path.join(OUT_DIR, "index.json"),
    JSON.stringify(index, null, 2) + "\n",
  );
  console.log(`[diagrams] built ${index.length} diagram(s) → public/diagrams/`);
}

function build(entry, i) {
  const { id, title } = entry;
  if (!id || !title) {
    throw new DiagramError(
      `diagrams/manifest.json[${i}]: every entry needs "id" and "title".`,
    );
  }

  const xmlPath = path.join(SRC_DIR, `${id}.drawio.xml`);
  const svgPath = path.join(SRC_DIR, `${id}.svg`);
  for (const [p, hint] of [
    [xmlPath, "draw.io → File → Save as → .drawio (XML)"],
    [svgPath, "draw.io → File → Export as → SVG (uncheck 'Include a copy of my diagram')"],
  ]) {
    if (!fs.existsSync(p)) {
      throw new DiagramError(
        `Missing ${path.relative(ROOT, p)} for diagram "${id}".\n  Get it from: ${hint}`,
      );
    }
  }

  const rawSvg = fs.readFileSync(svgPath, "utf8");
  const { graph, cellOwners } = parseDrawio(fs.readFileSync(xmlPath, "utf8"), id);
  const size = readIntrinsicSize(rawSvg);
  const { svg, annotated } = annotateSvg(rawSvg, graph, id, cellOwners);

  fs.writeFileSync(path.join(OUT_DIR, `${id}.svg`), svg);
  fs.writeFileSync(
    path.join(OUT_DIR, `${id}.graph.json`),
    JSON.stringify({ ...graph, ...size }, null, 2) + "\n",
  );
  fs.copyFileSync(xmlPath, path.join(OUT_DIR, `${id}.drawio.xml`));

  console.log(
    `[diagrams] ${id}: ${graph.nodes.length} nodes, ${graph.edges.length} edges, ` +
      `${annotated.vertices}/${graph.nodes.length} + ${annotated.edges}/${graph.edges.length} matched in SVG`,
  );

  return {
    ...entry,
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
  };
}

/* -------------------------------------------------------------------------- */
/* .drawio XML → graph                                                        */
/* -------------------------------------------------------------------------- */

function parseDrawio(xml, id) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    // A single <mxCell> child must still arrive as an array.
    isArray: (_name, jpath) =>
      jpath.endsWith("root.mxCell") ||
      jpath.endsWith("root.object") ||
      jpath.endsWith("mxfile.diagram"),
  });

  const doc = parser.parse(xml);
  const diagrams = doc?.mxfile?.diagram ?? (doc?.mxGraphModel ? [doc] : []);
  if (!diagrams.length) {
    throw new DiagramError(`${id}.drawio.xml: no <diagram> found.`);
  }

  // Multi-page .drawio files: only the first page is exported to SVG, so that
  // is the page whose graph must match.
  const model = resolveModel(diagrams[0], parser, id);

  const nodes = [];
  const edges = [];
  const cells = collectCells(model);
  const byId = new Map(cells.map((cell) => [cell.id, cell]));
  // Group labels and artwork marked non-connectable select their owning
  // draw.io group. Standalone decoration stays outside the graph.
  const cellOwners = new Map();
  for (const cell of cells.filter((cell) => cell.vertex)) {
    let owner = cell;
    const visited = new Set();
    while (owner && !owner.connectable) {
      if (visited.has(owner.id)) throw new DiagramError(`${id}: cyclic cell parent ${owner.id}`);
      visited.add(owner.id);
      owner = byId.get(owner.parent);
    }
    cellOwners.set(cell.id, owner?.vertex ? owner.id : null);
  }

  for (const cell of cells) {
    if (ROOT_CELL_IDS.has(cell.id)) continue;

    if (cell.edge) {
      // An edge with a dangling end cannot take part in adjacency, but it is
      // still a real drawn cell — keep it so it dims with everything else.
      edges.push({
        id: cell.id,
        label: cell.label,
        source: cellOwners.has(cell.source) ? cellOwners.get(cell.source) : cell.source ?? null,
        target: cellOwners.has(cell.target) ? cellOwners.get(cell.target) : cell.target ?? null,
      });
    } else if (cell.vertex && cell.connectable) {
      nodes.push({ id: cell.id, label: cell.label });
    }
  }

  if (!nodes.length) {
    throw new DiagramError(
      `${id}.drawio.xml: parsed 0 vertices. Is the file a draw.io XML export?`,
    );
  }

  return { graph: { id, nodes, edges, adjacency: buildAdjacency(nodes, edges) }, cellOwners };
}

/** draw.io stores a page either as inline XML or deflate+base64 text. */
function resolveModel(diagram, parser, id) {
  if (diagram?.mxGraphModel) return diagram.mxGraphModel;

  const payload = typeof diagram === "string" ? diagram : diagram?.["#text"];
  if (typeof payload !== "string" || payload.trim() === "") {
    throw new DiagramError(`${id}.drawio.xml: <diagram> has no model.`);
  }

  let inner;
  try {
    const raw = zlib.inflateRawSync(Buffer.from(payload.trim(), "base64"));
    inner = decodeURIComponent(raw.toString("binary"));
  } catch (cause) {
    throw new DiagramError(
      `${id}.drawio.xml: compressed <diagram> could not be inflated. ` +
        `In draw.io, turn off Extras → Compressed and save again. (${cause.message})`,
    );
  }

  const model = parser.parse(inner)?.mxGraphModel;
  if (!model) throw new DiagramError(`${id}.drawio.xml: inflated model had no <mxGraphModel>.`);
  return model;
}

/**
 * Cells appear either bare (`<mxCell id= vertex=>`) or wrapped in an
 * `<object>` that carries the id and label when the shape has custom
 * properties. Both shapes have to be flattened or half a diagram goes missing.
 */
function collectCells(model) {
  const root = model?.root ?? {};
  const out = [];

  for (const cell of root.mxCell ?? []) {
    out.push(readCell(cell, cell["@_id"], cell["@_value"]));
  }

  for (const obj of root.object ?? []) {
    const inner = Array.isArray(obj.mxCell) ? obj.mxCell[0] : obj.mxCell;
    if (!inner) continue;
    out.push(readCell(inner, obj["@_id"], obj["@_label"] ?? inner["@_value"]));
  }

  return out.filter((c) => c.id !== undefined);
}

function readCell(cell, id, value) {
  return {
    id: id === undefined ? undefined : String(id),
    label: cleanLabel(value),
    vertex: cell["@_vertex"] === "1",
    connectable: cell["@_connectable"] !== "0",
    parent: cell["@_parent"] !== undefined ? String(cell["@_parent"]) : undefined,
    edge: cell["@_edge"] === "1",
    source: cell["@_source"] !== undefined ? String(cell["@_source"]) : undefined,
    target: cell["@_target"] !== undefined ? String(cell["@_target"]) : undefined,
  };
}

/** draw.io labels are HTML fragments; the accessible name wants plain text. */
function cleanLabel(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Undirected 1-hop neighbours, plus the edges that justify each link. */
function buildAdjacency(nodes, edges) {
  const adj = Object.fromEntries(nodes.map((n) => [n.id, { nodes: [], edges: [] }]));

  for (const e of edges) {
    if (!e.source || !e.target) continue;
    for (const [from, to] of [
      [e.source, e.target],
      [e.target, e.source],
    ]) {
      const bucket = adj[from];
      if (!bucket) continue; // edge pointing at a group/root that is not a vertex
      if (!bucket.nodes.includes(to)) bucket.nodes.push(to);
      if (!bucket.edges.includes(e.id)) bucket.edges.push(e.id);
    }
  }

  return adj;
}

/* -------------------------------------------------------------------------- */
/* SVG annotation                                                             */
/* -------------------------------------------------------------------------- */

function annotateSvg(rawSvg, graph, id, cellOwners) {
  const vertexIds = new Set(graph.nodes.map((n) => n.id));
  const labels = new Map(graph.nodes.map((n) => [n.id, n.label]));
  const edges = new Map(graph.edges.map((e) => [e.id, e]));

  const seen = { vertices: new Set(), edges: new Set() };

  let svg = stripActiveContent(rawSvg);

  svg = svg.replace(/<g\b[^>]*>/g, (tag) => {
    const m = /\bdata-cell-id="([^"]*)"/.exec(tag);
    if (!m) return tag;
    const cellId = m[1];
    if (ROOT_CELL_IDS.has(cellId)) return tag;

    const ownerId = cellOwners.get(cellId);
    if (ownerId && vertexIds.has(ownerId)) {
      seen.vertices.add(ownerId);
      const label = labels.get(ownerId) || `요소 ${ownerId}`;
      return withAttrs(tag, {
        "data-cell-id": ownerId,
        "data-drawio-cell-id": cellId,
        "data-cell-kind": "vertex",
        tabindex: cellId === ownerId ? "0" : "-1",
        role: cellId === ownerId ? "button" : "presentation",
        ...(cellId === ownerId ? { "aria-label": escapeAttr(label) } : {}),
      });
    }

    const edge = edges.get(cellId);
    if (edge) {
      seen.edges.add(cellId);
      const attrs = { "data-cell-kind": "edge" };
      if (edge.source) attrs["data-cell-source"] = edge.source;
      if (edge.target) attrs["data-cell-target"] = edge.target;
      return withAttrs(tag, attrs);
    }

    return tag;
  });

  // Fail loudly. A diagram that renders but cannot be clicked is exactly the
  // failure mode both clones shipped, and it is invisible in a screenshot.
  if (seen.vertices.size !== graph.nodes.length || seen.edges.size !== graph.edges.length) {
    throw new DiagramError(
      `${id}.svg: incomplete XML join (${seen.vertices.size}/${graph.nodes.length} nodes, ${seen.edges.size}/${graph.edges.length} edges).\n` +
        `  The SVG needs data-cell-id attributes. Re-export from draw.io with\n` +
        `  "Include a copy of my diagram" unchecked, and make sure the SVG and\n` +
        `  the XML come from the same page of the same file.`,
    );
  }

  svg = makeResponsive(svg, id);
  return { svg, annotated: { vertices: seen.vertices.size, edges: seen.edges.size } };
}

/** Merge attributes into an existing tag, adding `dg-cell` to any class. */
function withAttrs(tag, attrs) {
  let out = tag.replace(/\s*\/?>$/, "");

  const classMatch = /\bclass="([^"]*)"/.exec(out);
  if (classMatch) {
    const classes = new Set(classMatch[1].split(/\s+/).filter(Boolean));
    classes.add("dg-cell");
    out = out.replace(/\bclass="[^"]*"/, `class="${[...classes].join(" ")}"`);
  } else {
    out += ` class="dg-cell"`;
  }

  for (const [k, v] of Object.entries(attrs)) {
    out = out.replace(new RegExp(`\\s${escapeRegExp(k)}="[^"]*"`), "");
    out += ` ${k}="${v}"`;
  }

  return out + ">";
}

/**
 * The viewer injects this markup into the page, so treat the export as
 * untrusted even though we produced it — a .drawio file can carry arbitrary
 * label HTML from whoever authored it in Drive.
 */
function stripActiveContent(svg) {
  return svg
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/(href|xlink:href)\s*=\s*"\s*javascript:[^"]*"/gi, "");
}

/**
 * The export's own pixel size, read before `makeResponsive` throws it away.
 * The viewer needs it to open at 1:1 — fit-to-width on a 2420px export shrinks
 * a 12px label to 5px, which is unreadable and cannot be fixed in CSS.
 */
function readIntrinsicSize(svg) {
  const tag = /<svg\b[^>]*>/.exec(svg)?.[0] ?? "";

  const w = /\swidth="([\d.]+)/.exec(tag);
  const h = /\sheight="([\d.]+)/.exec(tag);
  if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) };

  const viewBox = /\sviewBox="([^"]*)"/.exec(tag);
  if (viewBox) {
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { width: Math.round(parts[2]), height: Math.round(parts[3]) };
    }
  }

  return { width: 0, height: 0 };
}

/** Drop the fixed px size so the diagram scales with its container. */
function makeResponsive(svg, id) {
  return svg.replace(/<svg\b[^>]*>/, (tag) => {
    let out = tag;
    const viewBox = /\bviewBox="([^"]*)"/.exec(out);
    if (!viewBox) {
      const w = /\bwidth="([\d.]+)/.exec(out);
      const h = /\bheight="([\d.]+)/.exec(out);
      if (w && h) out = out.replace(/<svg\b/, `<svg viewBox="0 0 ${w[1]} ${h[1]}"`);
    }
    out = out
      .replace(/\swidth="[^"]*"/, "")
      .replace(/\sheight="[^"]*"/, "")
      .replace(/\sdata-diagram-id="[^"]*"/, "")
      // draw.io bakes a white page colour into the root. Drop it so the
      // viewer's canvas token owns the background instead.
      .replace(/\s*background-color:[^;"]*;?/, "")
      // draw.io writes every fill as light-dark(light, dark) and leaves the
      // root at `color-scheme: light dark`, so the artwork follows the
      // viewer's OS preference and renders black on a dark machine. The
      // canvas behind it is light in every theme (--diagram-canvas), so the
      // export is pinned to the light half rather than left to drift.
      .replace(/color-scheme:\s*[^;"]*/, "color-scheme: light")
      .replace(/\sstyle="\s*"/, "");
    if (!/color-scheme:/.test(out)) {
      out = /\sstyle="/.test(out)
        ? out.replace(/\sstyle="/, ' style="color-scheme: light; ')
        : out.replace(/<svg\b/, '<svg style="color-scheme: light"');
    }

    return out.replace(/\s*\/?>$/, "") + ` data-diagram-id="${id}" width="100%">`;
  });
}

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

try {
  main();
} catch (err) {
  if (err instanceof DiagramError) {
    console.error(`\n[diagrams] ${err.message}\n`);
    process.exit(1);
  }
  throw err;
}
