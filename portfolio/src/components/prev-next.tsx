import Link from "next/link";

import type { Doc } from "@/lib/content";

/** Bottom-of-article navigation, in the same order the left rail shows. */
export function PrevNext({ prev, next }: { prev?: Doc; next?: Doc }) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="문서 이동"
      className="mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
    >
      {prev ? <Card doc={prev} dir="prev" /> : <span className="hidden sm:block" />}
      {next && <Card doc={next} dir="next" />}
    </nav>
  );
}

function Card({ doc, dir }: { doc: Doc; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={doc.href}
      rel={dir}
      className={`group rounded-card border border-border bg-surface-1 px-4 py-3 no-underline transition-colors hover:border-border-strong ${
        isNext ? "sm:text-right" : ""
      }`}
    >
      <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
        {isNext ? "다음 →" : "← 이전"}
      </span>
      <span className="mt-1 block text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
        {doc.title}
      </span>
    </Link>
  );
}
