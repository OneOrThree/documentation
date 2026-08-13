import Link from "next/link";

import type { Doc } from "@/lib/content";
import type { SectionConfig } from "@root/site.config";

/**
 * Sticky left rail listing every document in the current section — PokeClip's
 * ADR sidebar, generalised to any section and fed from `content/` instead of a
 * hand-written list of 21 links.
 */
export function SectionRail({
  section,
  docs,
  activeSlug,
}: {
  section: SectionConfig;
  docs: Doc[];
  activeSlug: string;
}) {
  return (
    <nav
      aria-label={`${section.title} 목록`}
      className="sticky top-[5.3rem] max-h-[calc(100dvh-7rem)] overflow-y-auto"
    >
      <Link
        href={`/${section.slug}`}
        className="mb-3 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground no-underline hover:text-primary"
      >
        ← {section.title}
      </Link>

      <ul className="space-y-px border-l border-border">
        {docs.map((doc) => {
          const active = doc.slug === activeSlug;
          return (
            <li key={doc.slug}>
              <Link
                href={doc.href}
                aria-current={active ? "page" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-3 text-[0.8125rem] leading-snug no-underline transition-colors ${
                  active
                    ? "border-l-primary font-semibold text-primary"
                    : "border-l-transparent text-muted-foreground hover:border-l-border-strong hover:text-foreground"
                }`}
              >
                {doc.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
