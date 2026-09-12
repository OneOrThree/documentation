import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { findSection } from "@root/site.config";
import { getDiagram, getDiagramGraph, getDiagrams } from "@/lib/diagrams";
import { HtmlDiagramPanel } from "@/components/diagram/html-diagram-panel";
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
  if (!diagram) notFound();
  const graph = diagram.format === "html" ? undefined : getDiagramGraph(id);
  if (diagram.format !== "html" && !graph) notFound();

  const all = getDiagrams();
  const index = all.findIndex((d) => d.id === id);

  const selector = (
    <nav aria-label="다이어그램 선택" className="flex min-w-0 flex-wrap gap-2">
      {all.map((d, i) => {
        const active = d.id === id;
        return (
          <Link
            key={d.id}
            href={`/diagrams/${d.id}`}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-[0.55rem] rounded-pill border py-[0.4rem] pl-2 pr-[0.95rem] text-sm no-underline transition-colors ${
              active
                ? "border-foreground bg-foreground font-semibold text-background"
                : "border-border bg-surface-1 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span
              className={`grid size-[1.65rem] place-items-center rounded-pill font-mono text-[0.8125rem] font-bold ${
                active
                  ? "bg-background text-foreground"
                  : "bg-surface-2 text-foreground"
              }`}
            >
              {i}
            </span>
            {d.title}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-7 max-w-3xl">
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

      {diagram.format === "html" ? (
        <HtmlDiagramPanel diagram={diagram} index={index} selector={selector} />
      ) : graph ? (
        <DiagramPanel
          id={diagram.id}
          index={index}
          title={diagram.title}
          titleEn={diagram.titleEn}
          fitOnOpen={diagram.fitOnOpen}
          graph={graph}
          selector={selector}
          textView={
            <DiagramTextView
              graph={graph}
              index={index}
              title={diagram.title}
              titleEn={diagram.titleEn}
            />
          }
        />
      ) : null}

      {diagram.summary && (
        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          {diagram.summary}
        </p>
      )}
      {diagram.detailHref && (
        <Link
          href={diagram.detailHref}
          className="mt-3 inline-block text-sm text-primary no-underline hover:underline"
        >
          구현 단계·설계 근거 읽기 →
        </Link>
      )}

      <nav
        aria-label="다이어그램 이동"
        className="mt-12 flex justify-between gap-3"
      >
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
