"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { DiagramEntry } from "@/lib/diagrams";
import { DiagramHeading } from "@/components/diagram/diagram-heading";

/**
 * HTML 도면(R61)을 독립 프레임에서 그대로 유지하면서, 주변 컨트롤만
 * SVG 도면과 같은 줄로 맞춘다.
 *
 * 통일 대상은 제목 줄과 그 오른쪽의 배율 · 전체화면 · 원본 내려받기다.
 * 이 패널만 `새 창에서 보기` 링크 하나뿐이어서, 같은 다이어그램 묶음인데
 * 페이지마다 다른 도구를 주고 있었다. iframe 은 내부 문서를 건드릴 수 없으므로
 * 배율은 래퍼에 transform 을 걸어 바깥에서 확대한다.
 */

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 2, 2.5, 3] as const;
// 도면은 자기 폭에 맞게 저작돼 리더 폭에서 거의 1:1 로 그려진다. 바깥에서
// 또 확대하면 흐려지기만 하므로 100% 로 연다 — 확대는 컨트롤로 한다.
const FIT_ZOOM_INDEX = 3;

/** 내용 높이를 못 읽었을 때만 쓰는 폴백. 실제 높이는 프레임에서 측정한다. */
const FALLBACK_HEIGHT = 820;

export function HtmlDiagramPanel({
  diagram,
  index,
  selector,
}: {
  diagram: DiagramEntry;
  index: number;
  selector: React.ReactNode;
}) {
  const src = `/diagrams/${diagram.id}.html`;

  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [zoomIndex, setZoomIndex] = useState<number>(FIT_ZOOM_INDEX);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const zoom = ZOOM_STEPS[zoomIndex];

  /**
   * 프레임을 내용 높이에 맞춘다.
   *
   * 고정 높이를 쓰면 도면보다 프레임이 커서 빈 흰 판이 남는다. 도면 HTML 은
   * 같은 출처라 contentDocument 로 실제 높이를 읽을 수 있고, 내부 레이아웃이
   * 바뀌면 ResizeObserver 가 다시 잰다. 읽기에 실패하면 폴백 높이를 쓴다.
   */
  const measure = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const height = doc?.documentElement?.scrollHeight;
    if (height && height > 0) setContentHeight(height);
  }, []);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;

    const attach = () => {
      measure();
      const body = frame.contentDocument?.body;
      if (!body) return;
      observer = new ResizeObserver(() => measure());
      observer.observe(body);
    };

    frame.addEventListener("load", attach);
    if (frame.contentDocument?.readyState === "complete") attach();

    return () => {
      frame.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, [measure, src]);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await frameRef.current?.requestFullscreen();
  }, []);

  return (
    <>
      <div className="mb-6">{selector}</div>

      <figure className="m-0">
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <DiagramHeading
            index={index}
            title={diagram.title}
            titleEn={diagram.titleEn}
          />

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
                onClick={() => setZoomIndex(FIT_ZOOM_INDEX)}
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

            <TextControl onClick={toggleFullscreen}>
              {isFullscreen ? "전체화면 나가기" : "전체화면"}
            </TextControl>
            <a
              href={src}
              download={`${diagram.id}.html`}
              className="border-b border-border pb-px text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              원본 .html ↓
            </a>
          </div>
        </div>

        <div
          ref={frameRef}
          className="overflow-hidden rounded-card border border-border bg-white fullscreen:rounded-none fullscreen:border-0"
        >
          <div className="max-h-[78vh] overflow-auto fullscreen:h-dvh fullscreen:max-h-none">
            {/* 배율은 래퍼에 transform 으로 건다. iframe 내부 문서는
                교차 출처가 아니어도 스타일을 주입하지 않는다 — 검토한
                HTML 을 그대로 두는 것이 이 패널의 목적이다. */}
            <iframe
              ref={iframeRef}
              src={src}
              title={diagram.title}
              className="block border-0"
              style={{
                width: `${100 / zoom}%`,
                height: (contentHeight ?? FALLBACK_HEIGHT) / zoom,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
            />
          </div>
        </div>

        <figcaption className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
          검토한 HTML 을 그대로 표시합니다. 배율은 프레임 바깥에서 확대하므로
          문서 안의 글자 크기나 배치는 바뀌지 않습니다.
        </figcaption>
      </figure>
    </>
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
