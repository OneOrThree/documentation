import Link from "next/link";

import type { Doc } from "@/lib/content";
import { StatusPill } from "@/components/status-pill";

/**
 * The numbered link table both cloned sites use for every section index:
 * mono index number, bold title, keyword line, status pill, date.
 *
 * Rows come straight from `content/`, so the numbering can never drift out of
 * sync with what actually exists — in the clones these were literal arrays and
 * one entry was already stale ("작성 예정" pointing nowhere).
 */
export function NumberedIndex({ docs }: { docs: Doc[] }) {
  if (docs.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
        아직 문서가 없습니다. <code className="font-mono">content/</code> 아래에 <code className="font-mono">.mdx</code> 파일을 추가하면 이 목록에 바로 나타납니다.
      </p>
    );
  }

  return (
    <ol className="overflow-hidden rounded-card border border-border bg-surface-1">
      {docs.map((doc, i) => (
        <li key={doc.slug} className="border-b border-border last:border-b-0">
          <Link
            href={doc.href}
            className="group grid grid-cols-[2.6rem_minmax(0,1fr)] items-baseline gap-x-3 px-4 py-4 no-underline transition-colors hover:bg-surface-2 sm:grid-cols-[2.6rem_minmax(0,1fr)_auto] sm:px-5"
          >
            <span className="font-mono text-[0.8125rem] tabular-nums text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="min-w-0">
              <span className="block font-semibold leading-snug text-foreground group-hover:text-primary">
                {doc.title}
              </span>
              {doc.keywords.length > 0 && (
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {doc.keywords.join(" · ")}
                </span>
              )}
            </span>

            <span className="col-start-2 mt-2 flex items-center gap-2 sm:col-start-3 sm:mt-0 sm:justify-end">
              {doc.status && <StatusPill status={doc.status} />}
              {doc.date && (
                <time
                  dateTime={doc.date}
                  className="font-mono text-[0.6875rem] tabular-nums text-muted"
                >
                  {doc.date}
                </time>
              )}
              <span
                aria-hidden
                className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
