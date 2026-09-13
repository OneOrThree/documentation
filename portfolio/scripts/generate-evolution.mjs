#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUTPUT = path.join(ROOT, "src", "data", "evolution.json");
const args = process.argv.slice(2);
const repoArg = args.indexOf("--repo");
const sourceRepo = path.resolve(
  repoArg >= 0 && args[repoArg + 1]
    ? args[repoArg + 1]
    : process.env.GROMO_SOURCE_REPO ?? path.join(ROOT, "..", "..", "phone"),
);
const optional = args.includes("--if-available");
const check = args.includes("--check");

if (!fs.existsSync(path.join(sourceRepo, ".git"))) {
  if (optional && fs.existsSync(OUTPUT)) {
    console.log(`[evolution] source repo unavailable; keeping ${path.relative(ROOT, OUTPUT)}`);
    process.exit(0);
  }
  throw new Error(`Gromo source repository not found: ${sourceRepo}`);
}

const raw = execFileSync(
  "git",
  [
    "-C",
    sourceRepo,
    "log",
    "origin/main",
    "--first-parent",
    "--max-count=240",
    "--date=short",
    "--format=@@@%H\t%ad\t%s",
    "--name-only",
    "--",
    "docs",
    ".github/workflows",
    "server/scripts",
  ],
  { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
);

const entries = [];
let current;
for (const line of raw.split("\n")) {
  if (line.startsWith("@@@")) {
    if (current?.files.length) entries.push(current);
    const [sha, date, ...subject] = line.slice(3).split("\t");
    current = { sha, date, subject: subject.join("\t"), files: [] };
  } else if (current && line.trim()) {
    current.files.push(line.trim());
  }
}
if (current?.files.length) entries.push(current);

const history = entries.map((entry) => ({
  ...entry,
  shortSha: entry.sha.slice(0, 7),
  category: classify(entry.files),
  href: `https://github.com/OneOrThree/phone/commit/${entry.sha}`,
}));

const payload = JSON.stringify(
  {
    source: "OneOrThree/phone · origin/main · first-parent",
    generatedFrom: history[0]?.sha ?? null,
    generatedAt: history[0]?.date ?? null,
    entries: history,
  },
  null,
  2,
) + "\n";

if (check) {
  const existing = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
  if (existing !== payload) {
    console.error("[evolution] generated history is stale. Run npm run sync:evolution.");
    process.exit(1);
  }
  console.log(`[evolution] up to date (${history.length} commits)`);
} else {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, payload);
  console.log(`[evolution] wrote ${history.length} commits from ${sourceRepo}`);
}

function classify(files) {
  if (files.some((file) => file.startsWith("docs/architecture/") || file.startsWith("docs/conventions/"))) {
    return "아키텍처";
  }
  if (files.some((file) => file.startsWith("docs/prd/"))) return "제품 설계";
  if (files.some((file) => file.startsWith(".github/workflows/") || file.startsWith("server/scripts/"))) {
    return "전달·운영";
  }
  return "문서";
}
