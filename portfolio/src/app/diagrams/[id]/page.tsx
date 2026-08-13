import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findSection } from "@root/site.config";
import { getDiagram, getDiagramGraph, getDiagrams } from "@/lib/diagrams";
import { DiagramPanel } from "@/components/diagram/diagram-panel";
import { DiagramTextView } from "@/components/diagram/diagram-text-view";
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

/**
 * Diagram page.
 *
 * Follows the shape both cloned sites used: the section heading stays put, a
 * numbered selector switches between diagrams in place, and a segmented
 * control swaps the artwork for the same content as text. There is no list
 * index in between — the nav lands on a diagram.
 */
export default async function DiagramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diagram = getDiagram(id);
  const graph = getDiagramGraph(id);
  if (!diagram || !graph) notFound();

  const all = getDiagrams();
  const index = all.findIndex((d) => d.id === id);

  const selector = (
    <nav aria-label="다이어그램 선택" className="flex min-w-0 flex-wrap gap-1.5">
      {all.map((d, i) => {
        const active = d.id === id;
        return (
          <Link
            key={d.id}
            href={`/diagrams/${d.id}`}
            aria-current={active ? "page" : undefined}
            className={`flex items-baseline gap-1.5 rounded-pill px-3 py-1.5 text-[0.8125rem] no-underline transition-colors ${
              active
                ? "bg-surface-3 font-semibold text-primary"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-mono tabular-nums">{i}</span>
            <span>{d.title}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-8 max-w-3xl">
        <Kicker>
          {section.kicker} 0–{all.length - 1}
        </Kicker>
        <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em]">
          {section.title}
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {section.description}
        </p>
      </header>

      <DiagramPanel
        id={diagram.id}
        title={diagram.title}
        graph={graph}
        selector={selector}
        textView={<DiagramTextView graph={graph} />}
      />

      <section aria-label={`${diagram.title} 설명`} className="mt-6">
        <h2 className="flex items-baseline gap-2.5 font-bold">
          <span aria-hidden className="font-mono text-[1.625rem] leading-none text-primary">
            {index}
          </span>
          <span className="text-[1.375rem] tracking-[-0.015em]">{diagram.title}</span>
          <span className="font-mono text-[0.6875rem] tabular-nums text-muted">
            요소 {diagram.nodeCount} · 연결 {diagram.edgeCount}
          </span>
        </h2>
        {diagram.summary && (
          <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
            {diagram.summary}
          </p>
        )}
      </section>

      {all.length > 1 && (
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
      )}
    </div>
  );
}
