"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Interactive draw.io diagram.
 *
 * Both cloned sites shipped this control strip — zoom buttons, a fullscreen
 * button, and a caption promising that clicking a box highlights what it
 * connects to — with no behaviour behind any of it (`Runtime utilities emitted
 * for this clone: none`). The markup looked right in a screenshot and did
 * nothing in a browser. This component is that promise, honoured.
 *
 * The SVG is fetched rather than inlined into the page: the clones' diagram
 * routes were 180–335 KB of HTML each because the artwork was pasted into JSX.
 * Fetching keeps the document small and lets the browser cache the artwork
 * across routes, while still putting real DOM on the page to attach behaviour
 * to — which an <img> would not.
 */

interface Graph {
  id: string;
  nodes: { id: string; label: string }[];
  edges: { id: string; label: string; source: string | null; target: string | null }[];
  adjacency: Record<string, { nodes: string[]; edges: string[] }>;
}

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 2, 2.5, 3] as const;
const DEFAULT_ZOOM_INDEX = 3;

export function DiagramViewer({ id, title }: { id: string; title: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  const [svg, setSvg] = useState<string | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [zoomIndex, setZoomIndex] = useState<number>(DEFAULT_ZOOM_INDEX);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const zoom = ZOOM_STEPS[zoomIndex];

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [svgRes, graphRes] = await Promise.all([
          fetch(`/diagrams/${id}.svg`),
          fetch(`/diagrams/${id}.graph.json`),
        ]);
        if (!svgRes.ok || !graphRes.ok) {
          throw new Error(`HTTP ${svgRes.status}/${graphRes.status}`);
        }
        const [svgText, graphJson] = await Promise.all([
          svgRes.text(),
          graphRes.json() as Promise<Graph>,
        ]);
        if (cancelled) return;
        setSvg(svgText);
        setGraph(graphJson);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Paint the focus state onto the injected SVG. Classes rather than inline
  // styles so the transition lives in CSS with the rest of the design.
  useEffect(() => {
    const root = hostRef.current?.querySelector("svg");
    if (!root || !graph) return;

    const cells = root.querySelectorAll<SVGElement>(".dg-cell");

    if (!focusId) {
      root.removeAttribute("data-focus");
      for (const cell of cells) {
        cell.classList.remove("dg-hot");
        if (cell.getAttribute("data-cell-kind") === "vertex") {
          cell.setAttribute("aria-pressed", "false");
        }
      }
      return;
    }

    const adjacent = graph.adjacency[focusId];
    const hotNodes = new Set([focusId, ...(adjacent?.nodes ?? [])]);
    const hotEdges = new Set(adjacent?.edges ?? []);

    root.setAttribute("data-focus", focusId);
    for (const cell of cells) {
      const cellId = cell.getAttribute("data-cell-id") ?? "";
      cell.classList.toggle("dg-hot", hotNodes.has(cellId) || hotEdges.has(cellId));
      if (cell.getAttribute("data-cell-kind") === "vertex") {
        cell.setAttribute("aria-pressed", String(cellId === focusId));
      }
    }
  }, [focusId, graph, svg]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback((cellId: string | null) => {
    setFocusId((prev) => (prev === cellId ? null : cellId));
  }, []);

  const onPointerDown = useCallback(
    (event: React.MouseEvent) => {
      const cell = (event.target as Element).closest?.('[data-cell-kind="vertex"]');
      toggle(cell?.getAttribute("data-cell-id") ?? null);
    },
    [toggle],
  );

  // Escape is bound on the document, not the container: clicking an SVG <g>
  // does not move focus in Chrome (activeElement stays BODY), so a keydown
  // handler on the wrapper never fires for the mouse path — and the caption
  // promises Escape works.
  useEffect(() => {
    if (!focusId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocusId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focusId]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const cell = (event.target as Element).closest?.('[data-cell-kind="vertex"]');
      if (!cell) return;
      event.preventDefault(); // Space would otherwise scroll the page.
      toggle(cell.getAttribute("data-cell-id"));
    },
    [toggle],
  );

  const focused = focusId ? graph?.nodes.find((n) => n.id === focusId) : undefined;
  const linkCount = focusId ? (graph?.adjacency[focusId]?.nodes.length ?? 0) : 0;

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await frameRef.current?.requestFullscreen();
  }

  return (
    <figure className="m-0">
      <div
        ref={frameRef}
        className="overflow-hidden rounded-card border border-border bg-surface-1 fullscreen:rounded-none fullscreen:border-0"
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
          <div role="group" aria-label="확대·축소" className="flex items-center gap-1">
            <ControlButton
              label="축소"
              onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
              disabled={zoomIndex === 0}
            >
              −
            </ControlButton>
            <button
              type="button"
              onClick={() => setZoomIndex(DEFAULT_ZOOM_INDEX)}
              className="min-w-14 rounded-pill px-2 py-1 font-mono text-[0.6875rem] tabular-nums text-muted-foreground transition-colors hover:text-foreground"
              aria-live="polite"
            >
              {Math.round(zoom * 100)}%
            </button>
            <ControlButton
              label="확대"
              onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
              disabled={zoomIndex === ZOOM_STEPS.length - 1}
            >
              +
            </ControlButton>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {focusId && (
              <button
                type="button"
                onClick={() => setFocusId(null)}
                className="rounded-pill border border-border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
              >
                선택 해제 (Esc)
              </button>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-pill border border-border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {isFullscreen ? "나가기" : "전체화면"}
            </button>
            <a
              href={`/diagrams/${id}.drawio.xml`}
              download={`${id}.drawio.xml`}
              className="rounded-pill border border-border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              원본 .drawio ↓
            </a>
          </div>
        </div>

        {/* The diagram keeps a light canvas in every theme: a draw.io export
            carries baked-in fills like #f1f2f4, so recolouring the page around
            it would leave the artwork stranded. */}
        <div
          className="overflow-auto p-4 fullscreen:h-[calc(100dvh-3rem)]"
          style={{ backgroundColor: "var(--diagram-canvas)" }}
        >
          {error ? (
            <p className="px-2 py-10 text-center text-sm text-danger">
              다이어그램을 불러오지 못했습니다 ({error}). <code className="font-mono">npm run build</code> 로 <code className="font-mono">public/diagrams/</code> 가 생성됐는지 확인해 주세요.
            </p>
          ) : svg ? (
            <div
              ref={hostRef}
              onClick={onPointerDown}
              onKeyDown={onKeyDown}
              style={{ width: `${zoom * 100}%` }}
              className="mx-auto min-w-0 transition-[width] duration-150"
              // Build output, and `scripts/build-diagrams.mjs` strips <script>,
              // on* handlers and javascript: URLs from the export before it is
              // written — a .drawio file from Drive can carry arbitrary label
              // HTML from whoever authored it.
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div
              className="flex min-h-64 items-center justify-center text-sm text-muted"
              role="status"
            >
              다이어그램을 불러오는 중…
            </div>
          )}

          <noscript>
            <img src={`/diagrams/${id}.svg`} alt={title} style={{ width: "100%" }} />
          </noscript>
        </div>
      </div>

      <figcaption
        className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground"
        aria-live="polite"
      >
        {focused ? (
          <>
            <strong className="font-semibold text-foreground">{focused.label || focused.id}</strong>
            {" 기준 직접 연결 "}
            <span className="font-mono tabular-nums">{linkCount}</span>
            개. 다시 클릭하거나 Esc로 해제합니다.
          </>
        ) : (
          "요소를 클릭하면 그것과 직접 연결된 것만 남고 나머지는 흐려집니다. 키보드로는 Tab으로 이동해 Enter."
        )}
      </figcaption>
    </figure>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-pill border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
    >
      {children}
    </button>
  );
}
