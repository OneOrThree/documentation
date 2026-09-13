"use client";

import Link from "next/link";
import { useState } from "react";

import type { DiagramEntry, DiagramVersion } from "@/lib/diagrams";

export function VersionedHtmlDiagramPanel({
  diagram,
  index,
  selector,
  versions,
}: {
  diagram: DiagramEntry;
  index: number;
  selector: React.ReactNode;
  versions: DiagramVersion[];
}) {
  const [selectedId, setSelectedId] = useState(versions[0]?.id ?? "");
  const selected = versions.find((version) => version.id === selectedId) ?? versions[0];

  if (!selected) return null;
  const src = `/diagrams/${selected.artifactId}.html`;

  return (
    <>
      <div className="mb-6">{selector}</div>

      <section aria-labelledby="diagram-version-heading" className="mb-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p
              id="diagram-version-heading"
              className="font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              Diagram history
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              도면을 덮어쓰지 않고 당시 판단과 함께 보존합니다.
            </p>
          </div>
          <div role="group" aria-label="다이어그램 버전" className="flex flex-wrap gap-2">
            {versions.map((version) => {
              const active = version.id === selected.id;
              return (
                <button
                  key={version.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(version.id)}
                  className={`min-h-11 whitespace-nowrap rounded-pill border px-3.5 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary font-semibold text-primary-on"
                      : "border-border bg-surface-1 text-muted-foreground hover:border-border-strong hover:text-foreground"
                  }`}
                >
                  {version.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-card border border-border bg-white text-[#302e2a]">
        <div className="flex items-center justify-between gap-3 border-b border-[#e5e2dc] px-5 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-sm font-bold">
              {index} · {diagram.title} · {selected.label}
            </h2>
            {diagram.titleEn && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[#948e86]">
                {diagram.titleEn}
              </span>
            )}
          </div>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 whitespace-nowrap text-xs text-[#6d665e] underline underline-offset-4"
          >
            새 창에서 보기 ↗
          </a>
        </div>
        <iframe
          key={selected.artifactId}
          src={src}
          title={`${diagram.title} ${selected.label}`}
          className="block h-[680px] w-full border-0 max-sm:h-[650px]"
        />
      </section>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        <time dateTime={selected.date} className="mr-2 font-mono text-xs tabular-nums text-muted">
          {selected.date}
        </time>
        {selected.summary}
      </p>

      <section className="mt-7 overflow-hidden rounded-card border border-border bg-surface-1">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-primary-subtle px-5 py-3.5">
          <h2 className="text-sm font-bold text-foreground">{selected.evidenceTitle}</h2>
          <span className="whitespace-nowrap rounded-pill border border-border-strong bg-background px-2.5 py-1 font-mono text-[0.6875rem] text-muted-foreground">
            {selected.status}
          </span>
        </div>
        <div className="px-5 py-5">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {selected.evidenceSummary}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href={selected.detailHref} className="whitespace-nowrap text-primary no-underline hover:underline">
              근거 문서 읽기 →
            </Link>
            {selected.sourceHref && (
              <a
                href={selected.sourceHref}
                target="_blank"
                rel="noreferrer noopener"
                className="whitespace-nowrap text-primary no-underline hover:underline"
              >
                원본 커밋 보기 ↗
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
