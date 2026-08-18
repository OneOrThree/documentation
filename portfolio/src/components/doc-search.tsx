"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { SearchDoc } from "@/lib/search";
import { StatusPill } from "@/components/status-pill";

/**
 * Section search.
 *
 * Neither cloned site had any search at all, which is what made a section of
 * 21 ADRs or 27 specs hard to use — the numbered index is fine for browsing and
 * useless for "where did we write about the stampede".
 *
 * The index is a static JSON route built from `content/`, fetched on the first
 * keystroke. No server, no third-party service, and nothing downloaded for a
 * visitor who only ever browses.
 */

const SNIPPET_RADIUS = 70;

export function DocSearch({
  section,
  sectionTitle,
  total,
  fallback,
}: {
  section: string;
  sectionTitle: string;
  total: number;
  /** The normal index, shown whenever the query is empty. */
  fallback: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requested = useRef(false);

  const load = useCallback(() => {
    if (requested.current) return;
    requested.current = true;

    fetch(`/search/${section}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SearchDoc[]>;
      })
      .then(setIndex)
      .catch((cause) => setError(cause instanceof Error ? cause.message : String(cause)));
  }, [section]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);

      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        load();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [load]);

  const terms = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );

  const results = useMemo(() => {
    if (!index || terms.length === 0) return [];

    return index
      .map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [index, terms]);

  const searching = terms.length > 0;

  return (
    <div>
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            load();
            setQuery(e.target.value);
          }}
          onFocus={load}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("");
          }}
          placeholder={`${sectionTitle} 검색 — 제목 · 키워드 · 본문`}
          aria-label={`${sectionTitle} 검색`}
          className="w-full rounded-pill border border-border bg-surface-1 py-2.5 pl-11 pr-16 text-sm text-foreground placeholder:text-muted focus:border-border-strong"
        />
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-[0.625rem] text-muted sm:block">
          /
        </kbd>
      </div>

      <p className="mt-2.5 px-1 text-[0.8125rem] text-muted-foreground" aria-live="polite">
        {error ? (
          <span className="text-danger">검색 색인을 불러오지 못했습니다 ({error}).</span>
        ) : searching ? (
          <>
            <span className="font-mono tabular-nums">{results.length}</span>건 —{" "}
            <span className="font-mono">{query.trim()}</span>
          </>
        ) : (
          <>
            전체 <span className="font-mono tabular-nums">{total}</span>건. 본문까지 찾습니다.
          </>
        )}
      </p>

      <div className="mt-6">
        {!searching ? (
          fallback
        ) : results.length === 0 ? (
          <p className="rounded-card border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
            일치하는 문서가 없습니다. 다른 낱말로 찾아보세요.
          </p>
        ) : (
          <ol className="overflow-hidden rounded-card border border-border bg-surface-1">
            {results.map(({ doc }) => (
              <li key={doc.slug} className="border-b border-border last:border-b-0">
                <Link
                  href={doc.href}
                  className="group block px-4 py-4 no-underline transition-colors hover:bg-surface-2 sm:px-5"
                >
                  <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="font-semibold leading-snug text-foreground group-hover:text-primary">
                      {highlight(doc.title, terms)}
                    </span>
                    {doc.author && (
                      <span className="text-[0.75rem] text-muted-foreground">{doc.author}</span>
                    )}
                    {doc.status && <StatusPill status={doc.status} />}
                    {doc.date && (
                      <time
                        dateTime={doc.date}
                        className="font-mono text-[0.6875rem] tabular-nums text-muted"
                      >
                        {doc.date}
                      </time>
                    )}
                  </span>

                  <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {highlight(snippetFor(doc, terms), terms)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/** Every term must appear somewhere; where it appears decides the weight. */
function scoreDoc(doc: SearchDoc, terms: string[]): number {
  const title = doc.title.toLowerCase();
  const keywords = [...doc.keywords, doc.author ?? ""].join(" ").toLowerCase();
  const summary = (doc.summary ?? "").toLowerCase();
  const text = doc.text.toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 100;
    else if (keywords.includes(term)) score += 60;
    else if (summary.includes(term)) score += 40;
    else if (text.includes(term)) score += 15;
    else return 0; // a term nobody matched disqualifies the document
  }
  return score;
}

/** A window of body text around the first match, so the hit is visible. */
function snippetFor(doc: SearchDoc, terms: string[]): string {
  const haystack = doc.text || doc.summary || "";
  const lower = haystack.toLowerCase();

  let at = -1;
  for (const term of terms) {
    const i = lower.indexOf(term);
    if (i >= 0 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return (doc.summary ?? haystack).slice(0, SNIPPET_RADIUS * 2);

  const start = Math.max(0, at - SNIPPET_RADIUS);
  const end = Math.min(haystack.length, at + SNIPPET_RADIUS * 2);
  return (start > 0 ? "… " : "") + haystack.slice(start, end).trim() + (end < haystack.length ? " …" : "");
}

function highlight(text: string, terms: string[]): React.ReactNode {
  if (terms.length === 0) return text;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    terms.includes(part.toLowerCase()) ? (
      <mark key={i} className="rounded-[3px] bg-primary-subtle px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
