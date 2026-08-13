import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findSection } from "@root/site.config";
import { getDiagram, getDiagrams } from "@/lib/diagrams";
import { DiagramViewer } from "@/components/diagram/diagram-viewer";
import { Kicker } from "@/components/kicker";

const section = findSection("diagrams")!;

export const dynamicParams = false;

export function generateStaticParams() {
  return getDiagrams().map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const diagram = getDiagram(id);
  if (!diagram) return {};
  return { title: diagram.title, description: diagram.summary };
}

export default async function DiagramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diagram = getDiagram(id);
  if (!diagram) notFound();

  const all = getDiagrams();
  const index = all.findIndex((d) => d.id === id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Kicker>{section.kicker}</Kicker>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-[1.9rem] font-bold leading-tight tracking-[-0.02em]">
          {diagram.title}
        </h1>
        <p className="font-mono text-[0.6875rem] tabular-nums text-muted">
          요소 {diagram.nodeCount} · 연결 {diagram.edgeCount}
        </p>
      </div>

      {diagram.summary && (
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {diagram.summary}
        </p>
      )}

      {all.length > 1 && (
        <nav aria-label="다이어그램 목록" className="mt-6">
          <ul className="flex flex-wrap gap-1.5">
            {all.map((d, i) => {
              const active = d.id === id;
              return (
                <li key={d.id}>
                  <Link
                    href={`/diagrams/${d.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-pill px-3 py-1 font-mono text-[0.75rem] tabular-nums no-underline transition-colors ${
                      active
                        ? "bg-surface-3 font-semibold text-primary"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {String(i).padStart(2, "0")}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="mt-6">
        <DiagramViewer id={diagram.id} title={diagram.title} />
      </div>

      <nav aria-label="다이어그램 이동" className="mt-10 flex justify-between gap-3">
        {index > 0 ? (
          <Link
            href={`/diagrams/${all[index - 1]!.id}`}
            rel="prev"
            className="text-sm text-primary no-underline hover:underline"
          >
            ← {all[index - 1]!.title}
          </Link>
        ) : (
          <span />
        )}
        {index < all.length - 1 && (
          <Link
            href={`/diagrams/${all[index + 1]!.id}`}
            rel="next"
            className="text-right text-sm text-primary no-underline hover:underline"
          >
            {all[index + 1]!.title} →
          </Link>
        )}
      </nav>
    </div>
  );
}
