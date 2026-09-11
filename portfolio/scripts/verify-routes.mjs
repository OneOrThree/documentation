#!/usr/bin/env node
/**
 * Hit every route the site claims to have and report the status codes.
 *
 * The URL list is derived from `content/` and `diagrams/manifest.json` — the
 * *inputs* — never from the generated `.next` tree. Checking a build against
 * its own output only proves it is self-consistent; a route that silently
 * failed to generate would be missing from both sides and look fine. That
 * mistake cost a full verification pass on the cloned sites.
 *
 *   npm run dev &            # or: npm run build && npm start
 *   npm run verify           # optionally: npm run verify -- http://localhost:3001
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

function readConfig() {
  const config = fs.readFileSync(path.join(ROOT, "site.config.ts"), "utf8");
  const slugs = [...config.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (slugs.length === 0)
    throw new Error("No sections found in site.config.ts");

  // Sections carrying `search: true` also publish a static index route; the
  // search box is dead without it, and nothing else would catch that.
  const searchable = [
    ...config.matchAll(/slug:\s*"([^"]+)"[\s\S]*?(?=\n  \{|\n\];)/g),
  ]
    .filter((m) => /search:\s*true/.test(m[0]))
    .map((m) => m[1]);

  return { slugs, searchable };
}

function collectUrls() {
  const urls = ["/", "/llms.txt", "/sitemap.xml", "/robots.txt"];
  const { slugs, searchable } = readConfig();

  for (const section of searchable) urls.push(`/search/${section}`);

  for (const section of slugs) {
    urls.push(`/${section}`);
    const dir = path.join(ROOT, "content", section);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      urls.push(`/${section}/${file.replace(/\.mdx$/, "")}`);
    }
  }

  const manifestPath = path.join(ROOT, "diagrams", "manifest.json");
  if (fs.existsSync(manifestPath)) {
    for (const entry of JSON.parse(fs.readFileSync(manifestPath, "utf8"))) {
      urls.push(`/diagrams/${entry.id}`);
      if (entry.format === "html") {
        urls.push(`/diagrams/${entry.id}.html`);
        continue;
      }
      // The viewer is useless without these three, and they are produced by a
      // separate build step, so check them as routes in their own right.
      urls.push(`/diagrams/${entry.id}.svg`);
      urls.push(`/diagrams/${entry.id}.graph.json`);
      urls.push(`/diagrams/${entry.id}.drawio.xml`);
    }
  }

  return urls;
}

const urls = collectUrls();
const failures = [];

for (const url of urls) {
  let status;
  try {
    // Manual redirect handling so an unintended redirect is visible rather than
    // silently followed — /diagrams redirecting to the first diagram is the one
    // we expect, and it should read as a redirect in the output.
    status = (await fetch(`${BASE}${url}`, { redirect: "manual" })).status;
  } catch (cause) {
    status = `ERR ${cause.message}`;
  }
  const redirected = status === 307 || status === 308;
  const ok = status === 200 || redirected;
  if (!ok) failures.push({ url, status });
  console.log(
    `${ok ? (redirected ? "  ->" : "  ok") : "FAIL"}  ${String(status).padEnd(5)} ${url}`,
  );
}

console.log(`\n${urls.length - failures.length}/${urls.length} ok  (${BASE})`);
if (failures.length > 0) process.exit(1);
