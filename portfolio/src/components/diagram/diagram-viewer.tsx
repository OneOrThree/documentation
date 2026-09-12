"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DiagramGraph } from "@/lib/diagrams";
import { DiagramHeading } from "@/components/diagram/diagram-heading";

/**
 * Interactive draw.io diagram.
 *
 * Both cloned sites shipped this control strip — zoom, fullscreen, and a
 * caption promising that clicking a box highlights what it connects to — with
 * no behaviour behind any of it (`Runtime utilities emitted for this clone:
 * none`). The markup looked right in a screenshot and did nothing in a browser.
 * This component is that promise, honoured.
 *
 * The SVG is fetched rather than inlined into the page: the clones' diagram
 * routes were 180–335 KB of HTML each because the artwork was pasted into JSX.
 * Fetching keeps the document small and lets the browser cache the artwork
 * across routes, while still putting real DOM on the page to attach behaviour
 * to — which an <img> would not.
 */

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6] as const;
const FIT_ZOOM_INDEX = 3; // 100% — the artwork fits the frame width exactly.

export function DiagramViewer({
  id,
  index,
  title,
  titleEn,
  fitOnOpen = false,
  graph,
}: {
  id: string;
  index: number;
  title: string;
  titleEn?: string;
  fitOnOpen?: boolean;
  // Read at build time and passed down, so only the artwork is fetched here.
  graph: DiagramGraph;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  // The wheel handler is bound once and must not close over a stale zoom.
  const zoomIndexRef = useRef<number>(FIT_ZOOM_INDEX);
  // Where the cursor was when a pinch changed the zoom, so the point under it
  // can be put back after the re-render.
  const anchorRef = useRef<{ x: number; y: number; zoom: number } | null>(null);

  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [zoomIndex, setZoomIndex] = useState<number>(FIT_ZOOM_INDEX);
  // Where the % button returns to. Not a constant: it is measured per diagram.
  const [homeZoomIndex, setHomeZoomIndex] = useState<number>(FIT_ZOOM_INDEX);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const zoom = ZOOM_STEPS[zoomIndex];
  zoomIndexRef.current = zoomIndex;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/diagrams/${id}.svg`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const svgText = await res.text();
        if (cancelled) return;
        setSvg(svgText);
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

  // Switching diagrams must not carry the previous selection over.
  useEffect(() => setFocusId(null), [id]);

  /**
   * Open at roughly 1:1 instead of fit-to-width.
   *
   * These exports are wide — the service diagram is 2420px — and the frame is
   * about 1070px. Fitting it to the frame renders every label at 44%, which
   * turns 12px type into 5px: legible in a thumbnail, not on a page. So the
   * opening zoom is measured, not fixed, and the frame pans instead. Small
   * diagrams keep fit-to-width, since blowing an 880px export past its own
   * size only makes it fuzzy. Measured once per diagram, not on every resize:
   * re-deriving it while the reader is panning fights the zoom controls.
   */
  useEffect(() => {
    if (fitOnOpen) {
      setZoomIndex(FIT_ZOOM_INDEX);
      setHomeZoomIndex(FIT_ZOOM_INDEX);
      return;
    }
    const artwork = graph.width ?? 0;
    const frame = scrollRef.current;
    if (!svg || !artwork || !frame) return;

    const style = getComputedStyle(frame);
    const available =
      frame.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    if (available <= 0) return;

    const oneToOne = artwork / available;
    const step = ZOOM_STEPS.findIndex((z) => z >= oneToOne);
    const opening =
      step === -1 ? ZOOM_STEPS.length - 1 : Math.max(FIT_ZOOM_INDEX, step);

    setZoomIndex(opening);
    setHomeZoomIndex(opening);
  }, [svg, graph.width, id, fitOnOpen]);

  // Paint the focus state onto the injected SVG. Classes rather than inline
  // styles so the transition lives in CSS with the rest of the design.
  useEffect(() => {
    const root = hostRef.current?.querySelector("svg");
    if (!root) return;

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
    const members = graph.groups?.[focusId] ?? [];
    for (const member of members) hotNodes.add(member);
    if (members.length) {
      for (const edge of graph.edges) {
        if (edge.source && edge.target && hotNodes.has(edge.source) && hotNodes.has(edge.target)) {
          hotEdges.add(edge.id);
        }
      }
    }

    root.setAttribute("data-focus", focusId);
    for (const cell of cells) {
      const cellId = cell.getAttribute("data-cell-id") ?? "";
      cell.classList.toggle("dg-hot", hotNodes.has(cellId) || hotEdges.has(cellId));
      if (cell.getAttribute("data-cell-kind") === "vertex") {
        cell.setAttribute("aria-pressed", String(cellId === focusId));
      }
    }
  }, [focusId, graph, svg]);

  /**
   * Pinch-to-zoom over the diagram belongs to the diagram, not to the browser.
   *
   * A trackpad pinch arrives as a wheel event with ctrlKey set, and Chrome
   * treats it as page zoom unless the event is cancelled — so reading a
   * diagram meant scaling the whole site around it. This is bound natively
   * with { passive: false }: React's onWheel is registered passively and
   * preventDefault() there is a no-op, which is exactly the shape of bug that
   * looks fixed in code review and does nothing in a browser.
   *
   * A plain wheel is left alone — that still pans the frame, which is what
   * the artwork being wider than the window calls for.
   */
  useEffect(() => {
    const frame = scrollRef.current;
    if (!frame || !svg) return;

    // A pinch emits a stream of small deltas; one zoom step per notch of
    // travel keeps a single gesture from crossing the whole scale.
    const STEP_THRESHOLD = 24;
    let travelled = 0;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      travelled += event.deltaY;
      if (Math.abs(travelled) < STEP_THRESHOLD) return;

      const direction = travelled > 0 ? -1 : 1;
      travelled = 0;

      const current = zoomIndexRef.current;
      const next = Math.min(
        ZOOM_STEPS.length - 1,
        Math.max(0, current + direction),
      );
      if (next === current) return;

      const rect = frame.getBoundingClientRect();
      anchorRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        zoom: ZOOM_STEPS[current],
      };
      setZoomIndex(next);
    };

    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, [svg]);

  // Put the pixel that was under the cursor back under the cursor. Without
  // this the diagram lurches toward its top-left corner on every step, which
  // makes zooming into a corner of a 2420px drawing impossible.
  useEffect(() => {
    const frame = scrollRef.current;
    const anchor = anchorRef.current;
    if (!frame || !anchor) return;
    anchorRef.current = null;

    const ratio = ZOOM_STEPS[zoomIndex] / anchor.zoom;
    frame.scrollLeft = (frame.scrollLeft + anchor.x) * ratio - anchor.x;
    frame.scrollTop = (frame.scrollTop + anchor.y) * ratio - anchor.y;
  }, [zoomIndex]);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

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

  /**
   * Stable across renders on purpose.
   *
   * React 19 compares `dangerouslySetInnerHTML` by object identity, so a fresh
   * `{ __html }` literal each render re-commits the markup on every zoom step:
   * the browser re-parsed a 6 MB SVG per click and the node was replaced, which
   * silently dropped whatever the reader had selected. Measured with a
   * MutationObserver — one style change, five children swapped, every time.
   */
  const artwork = useMemo(() => (svg ? { __html: svg } : null), [svg]);

  const focused = focusId ? graph.nodes.find((n) => n.id === focusId) : undefined;
  const linkCount = focusId ? (graph.adjacency[focusId]?.nodes.length ?? 0) : 0;
  const memberCount = focusId ? (graph.groups?.[focusId]?.length ?? 0) : 0;

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await frameRef.current?.requestFullscreen();
  }

  return (
    <figure className="m-0">
      <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <DiagramHeading index={index} title={title} titleEn={titleEn} />

        <div className="flex items-center gap-3.5 text-[0.8125rem]">
          <div
            role="group"
            aria-label="확대·축소"
            className="flex items-center gap-0.5"
          >
            <ZoomButton
              label="축소"
              onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
              disabled={zoomIndex === 0}
            >
              −
            </ZoomButton>
            <button
              type="button"
              onClick={() => setZoomIndex(homeZoomIndex)}
              className="min-w-11 rounded-pill px-1 py-0.5 font-mono text-[0.6875rem] tabular-nums text-muted-foreground transition-colors hover:text-foreground"
              aria-live="polite"
            >
              {Math.round(zoom * 100)}%
            </button>
            <ZoomButton
              label="확대"
              onClick={() =>
                setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))
              }
              disabled={zoomIndex === ZOOM_STEPS.length - 1}
            >
              +
            </ZoomButton>
          </div>

          {focusId && (
            <TextControl onClick={() => setFocusId(null)}>선택 해제 (Esc)</TextControl>
          )}
          <TextControl onClick={toggleFullscreen}>
            {isFullscreen ? "전체화면 나가기" : "전체화면"}
          </TextControl>
          <a
            href={`/diagrams/${id}.drawio.xml`}
            download={`${id}.drawio.xml`}
            className="border-b border-border pb-px text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            원본 .drawio ↓
          </a>
        </div>
      </div>

      <div
        ref={frameRef}
        className="overflow-hidden rounded-card border border-border fullscreen:rounded-none fullscreen:border-0"
      >
        {/* The diagram keeps a light canvas in every theme: a draw.io export
            carries baked-in fills like #f1f2f4, so recolouring the page around
            it would leave the artwork stranded. */}
        {/* Height is capped so a 1:1 diagram stays a window you pan, not a
            2000px slab that pushes the caption off the screen. Fullscreen
            drops the cap and takes the viewport instead. */}
        <div
          ref={scrollRef}
          className="max-h-[78vh] overflow-auto p-4 fullscreen:h-dvh fullscreen:max-h-none"
          style={{
            backgroundColor: "var(--diagram-canvas)",
            backgroundImage:
              "radial-gradient(circle, var(--diagram-grid) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        >
          {error ? (
            <p className="px-2 py-10 text-center text-sm text-danger">
              다이어그램을 불러오지 못했습니다 ({error}).{" "}
              <code className="font-mono">npm run build</code> 로{" "}
              <code className="font-mono">public/diagrams/</code> 가 생성됐는지 확인해 주세요.
            </p>
          ) : svg ? (
            <div
              ref={hostRef}
              onClick={onPointerDown}
              onKeyDown={onKeyDown}
              // min-width, not just a percentage: letting the artwork shrink to
              // the viewport made every label illegible on a phone. Below this
              // the frame scrolls horizontally instead, and 문서 보기 is there
              // for anyone who would rather read it than pan it.
              style={{ width: `${zoom * 100}%`, minWidth: "34rem" }}
              // No width transition: animating a layout property relaid out a
              // 150-node SVG on every frame, and the interpolation stalled at
              // its start value so a 250% zoom rendered at 100%.
              className="mx-auto"
              // Build output, and `scripts/build-diagrams.mjs` strips <script>,
              // on* handlers and javascript: URLs from the export before it is
              // written — a .drawio file from Drive can carry arbitrary label
              // HTML from whoever authored it.
              dangerouslySetInnerHTML={artwork ?? undefined}
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
            <strong className="font-semibold text-foreground">
              {focused.label || focused.id}
            </strong>
            {memberCount ? " 내부 구성 요소 " : " 기준 직접 연결 "}
            <span className="font-mono tabular-nums">{memberCount || linkCount}</span>
            개. 다시 클릭하거나 Esc로 해제합니다.
          </>
        ) : (
          "요소를 클릭하면 그것과 직접 연결된 것만 남고 나머지는 흐려집니다. 키보드로는 Tab으로 이동해 Enter."
        )}
      </figcaption>
    </figure>
  );
}

function ZoomButton({
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
      className="flex size-6 items-center justify-center rounded-pill border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
    >
      {children}
    </button>
  );
}

function TextControl({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-b border-border pb-px text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}
