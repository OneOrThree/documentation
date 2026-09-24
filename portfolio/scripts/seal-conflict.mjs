#!/usr/bin/env node
// Encrypt private/conflict.mdx (gitignored) into src/data/conflict.enc.json.
// Usage: CONFLICT_KEY=<64 hex> node scripts/seal-conflict.mjs
import { createCipheriv, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const hex = process.env.CONFLICT_KEY;
if (!hex || hex.length !== 64) throw new Error("CONFLICT_KEY must be 64 hex chars");
const root = new URL("..", import.meta.url);
const plain = readFileSync(new URL("private/conflict.mdx", root), "utf8");
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", Buffer.from(hex, "hex"), iv);
const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
const sealed = { iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") };
writeFileSync(new URL("src/data/conflict.enc.json", root), JSON.stringify(sealed) + "\n");
console.log(`sealed ${plain.length} chars`);
