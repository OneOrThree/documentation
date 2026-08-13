"use client";

import { useEffect, useState } from "react";

import type { Heading } from "@/lib/content";

/**
 * Right-rail table of contents with scroll spy.
 *
 * Neither clone had one on its document pages — FillMap only put a TOC on the
 * six long-form `/embeds/*` explainers, and those were the pages that most
 * needed it, which rather makes the point.
 */
export function Toc({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // "The last heading whose top has passed under the header" — measured
    // directly rather than inferred from intersection events. A section can be
    // taller than the viewport, so at any moment there may be no heading on
    // screen at all; asking which one we most recently scrolled past always has
    // an answer, and it is the one a reader expects to see marked.
    const HEADER_OFFSET = 96;
    let frame = 0;

    const update = () => {
      frame = 0;

      let current = elements[0]!;
      for (const el of elements) {
        if (el.getBoundingClientRect().top > HEADER_OFFSET) break;
        current = el;
      }

      // The final section is often too short to ever reach the offset, so it
      // would otherwise never light up. At the bottom of the page it is the
      // only sensible answer.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;
      if (atBottom) current = elements[elements.length - 1]!;

      setActiveId(current.id);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="목차"
      className="sticky top-[5.3rem] max-h-[calc(100dvh-7rem)] overflow-y-auto"
    >
      <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
        목차
      </p>
      <ul className="space-y-px border-l border-border">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1 text-[0.8125rem] leading-snug no-underline transition-colors ${
                  h.depth === 3 ? "pl-6" : "pl-3"
                } ${
                  active
                    ? "border-l-primary font-semibold text-primary"
                    : "border-l-transparent text-muted-foreground hover:border-l-border-strong hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
