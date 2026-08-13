import { getDocs } from "@/lib/content";

/**
 * Build-time search index, one per section.
 *
 * Body text is included, not just titles: on a documentation site the sentence
 * you half-remember is almost never in the heading. The index is served as a
 * static JSON route and fetched on the first keystroke, so a visitor who never
 * searches pays nothing for it.
 */

export interface SearchDoc {
  slug: string;
  href: string;
  title: string;
  summary?: string;
  status?: string;
  date?: string;
  keywords: string[];
  /** Body as plain text — markdown syntax removed, prose and code kept. */
  text: string;
}

/** Strip the markdown that would otherwise show up in a snippet as noise. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, (block) =>
      // Keep the code, drop the fence and language tag — identifiers like
      // `region_stats` are exactly what someone searches for.
      block.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, ""),
    )
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`>]/g, "")
    .replace(/^\s*\|/gm, " ")
    .replace(/\|/g, " ")
    // Table separator rows survive pipe-stripping as loose runs of dashes and
    // would otherwise open every snippet with "--- --- ---".
    .replace(/(^|\s)[-–—:]{3,}(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSectionIndex(section: string): SearchDoc[] {
  return getDocs(section).map((doc) => ({
    slug: doc.slug,
    href: doc.href,
    title: doc.title,
    summary: doc.summary,
    status: doc.status,
    date: doc.date,
    keywords: doc.keywords,
    text: toPlainText(doc.body),
  }));
}
