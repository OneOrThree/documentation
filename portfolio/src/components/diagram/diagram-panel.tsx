"use client";

import { useState } from "react";

import type { DiagramGraph } from "@/lib/diagrams";
import { DiagramViewer } from "@/components/diagram/diagram-viewer";

/**
 * The "다이어그램 / 문서 보기" segmented control both cloned sites showed above
 * their diagrams, with the second half actually implemented.
 *
 * Selector and toggle share one wrapping row, exactly as the source did: with
 * six diagrams the pills fill the line and the toggle drops to the next one,
 * left-aligned.
 *
 * The selector and the text view arrive as props so they stay server-rendered —
 * only the switch itself needs to be a client component.
 */
export function DiagramPanel({
  id,
  index,
  title,
  titleEn,
  fitOnOpen,
  graph,
  selector,
  textView,
}: {
  id: string;
  index: number;
  title: string;
  titleEn?: string;
  fitOnOpen?: boolean;
  graph: DiagramGraph;
  selector?: React.ReactNode;
  textView: React.ReactNode;
}) {
  const [view, setView] = useState<"diagram" | "doc">("diagram");

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {selector}

        <div
          role="group"
          aria-label="보기 방식"
          className="flex shrink-0 rounded-pill border border-border bg-surface-1 p-[0.1875rem]"
        >
          <ViewButton active={view === "diagram"} onClick={() => setView("diagram")}>
            다이어그램
          </ViewButton>
          <ViewButton active={view === "doc"} onClick={() => setView("doc")}>
            문서 보기
          </ViewButton>
        </div>
      </div>

      {view === "diagram" ? (
        <DiagramViewer
          id={id}
          index={index}
          title={title}
          titleEn={titleEn}
          fitOnOpen={fitOnOpen}
          graph={graph}
        />
      ) : (
        textView
      )}
    </>
  );
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-pill px-3.5 py-1 text-sm transition-colors ${
        active
          ? "bg-foreground font-semibold text-background"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
