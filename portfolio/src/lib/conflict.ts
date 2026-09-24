import { createDecipheriv, createHmac, timingSafeEqual } from "node:crypto";

/**
 * The 갈등관리 page. The repo is public, so the document is committed only as
 * AES-256-GCM ciphertext (src/data/conflict.enc.json, sealed by
 * scripts/seal-conflict.mjs). CONFLICT_KEY and CONFLICT_PASSWORD live in the
 * Vercel environment, never in git.
 */

export const COOKIE = "conflict_auth";

type Sealed = { iv: string; tag: string; data: string };

function key(): Buffer | null {
  const hex = process.env.CONFLICT_KEY;
  return hex && hex.length === 64 ? Buffer.from(hex, "hex") : null;
}

export function configured(): boolean {
  return Boolean(key() && process.env.CONFLICT_PASSWORD);
}

/** Cookie value proving the password was entered; changes when the key rotates. */
export function sessionToken(): string {
  return createHmac("sha256", key()!).update("conflict-session-v1").digest("hex");
}

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string): boolean {
  return configured() && same(input, process.env.CONFLICT_PASSWORD!);
}

export function checkSession(cookie: string | undefined): boolean {
  return configured() && cookie !== undefined && same(cookie, sessionToken());
}

export function open(sealed: Sealed): string {
  const decipher = createDecipheriv("aes-256-gcm", key()!, Buffer.from(sealed.iv, "base64"));
  decipher.setAuthTag(Buffer.from(sealed.tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(sealed.data, "base64")), decipher.final()]).toString("utf8");
}
