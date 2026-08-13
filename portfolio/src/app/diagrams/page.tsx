import type { Metadata } from "next";
import Link from "next/link";

import { findSection } from "@root/site.config";
import { getDiagrams } from "@/lib/diagrams";
import { Kicker } from "@/components/kicker";

const section = findSection("diagrams")!;

export const metadata: Metadata = {
  title: section.title,
  description: section.description,
};

export default function DiagramsIndexPage() {
  const diagrams = getDiagrams();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Kicker>{section.kicker}</Kicker>
      <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em]">
        {section.title}
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        {section.description}
      </p>

      {diagrams.length === 0 ? (
        <p className="mt-10 rounded-card border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
          아직 다이어그램이 없습니다. <code className="font-mono">diagrams/</code> 에 <code className="font-mono">.drawio.xml</code> 과 <code className="font-mono">.svg</code> 를 넣고{" "}
          <code className="font-mono">manifest.json</code> 에 등록해 주세요.
        </p>
      ) : (
        <ol className="mt-10 overflow-hidden rounded-card border border-border bg-surface-1">
          {diagrams.map((diagram, i) => (
            <li key={diagram.id} className="border-b border-border last:border-b-0">
              <Link
                href={`/diagrams/${diagram.id}`}
                className="group grid grid-cols-[2.6rem_minmax(0,1fr)_auto] items-baseline gap-x-3 px-4 py-4 no-underline transition-colors hover:bg-surface-2 sm:px-5"
              >
                <span className="font-mono text-[0.8125rem] tabular-nums text-muted">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground group-hover:text-primary">
                    {diagram.title}
                  </span>
                  {diagram.summary && (
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {diagram.summary}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap font-mono text-[0.6875rem] tabular-nums text-muted">
                  {diagram.nodeCount}개 요소
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
