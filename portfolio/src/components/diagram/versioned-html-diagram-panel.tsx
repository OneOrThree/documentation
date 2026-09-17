"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { DiagramEntry, DiagramVersion } from "@/lib/diagrams";

/** 도면을 재기 전과, 안쪽 스크롤 영역이 없는 도면에 쓰는 기본 높이. */
const BASE_HEIGHT = 680;

/** 위 선택기와 버전 버튼이 이미 제목을 보여 주므로 프레임 상단 제목줄은 두지 않는다. */
export function VersionedHtmlDiagramPanel({
  diagram,
  selector,
  versions,
}: {
  diagram: DiagramEntry;
  selector: React.ReactNode;
  versions: DiagramVersion[];
}) {
  const [selectedId, setSelectedId] = useState(versions[0]?.id ?? "");
  const selected = versions.find((version) => version.id === selectedId) ?? versions[0];
  const src = selected ? `/diagrams/${selected.artifactId}.html` : "";

  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(BASE_HEIGHT);

  /**
   * 프레임을 도면 전체가 들어가는 높이로 맞춘다.
   *
   * 아키텍처 도면 HTML 은 스스로 `#viewport{height:calc(100vh - 105px)}` 로
   * 자기 높이를 창에 맞추고 그 안에서 스크롤한다. iframe 안에서 100vh 는
   * 프레임 높이이므로 680px 고정 프레임에서는 1500px 짜리 SVG 가 잘려
   * 페이지 스크롤과 프레임 안 스크롤이 겹쳤다.
   *
   * 그래서 문서의 전체 높이를 재는 대신 **안쪽 스크롤 영역이 감추고 있는
   * 양(slack)만큼 프레임을 늘린다**. 프레임이 커지면 100vh 가 따라 커져
   * 안쪽 스크롤이 사라지고, 내용이 짧아지면(문서 보기 전환) 음수가 되어
   * 다시 줄어든다. 한두 번이면 수렴하고 그 뒤로는 값이 변하지 않는다.
   */
  const measure = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc?.body) return;

    const scroller = mainScroller(doc);
    if (!scroller) return;

    const slack = scroller.scrollHeight - scroller.clientHeight;
    if (Math.abs(slack) < 2) return;

    const next = Math.max(BASE_HEIGHT, frame.clientHeight + slack);
    setHeight((prev) => (Math.abs(prev - next) < 2 ? prev : next));
  }, []);

  /** 버전을 바꾸면 도면이 달라지므로 기본 높이에서 다시 잰다. */
  useEffect(() => setHeight(BASE_HEIGHT), [src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;

    const attach = () => {
      measure();
      const doc = frame.contentDocument;
      if (!doc?.body) return;

      observer = new ResizeObserver(() =>
        requestAnimationFrame(() => measure()),
      );
      observer.observe(doc.body);

      // 스크롤 영역 자체는 CSS 로 높이가 고정돼 있어 내용이 바뀌어도 리사이즈가
      // 일어나지 않는다. `다이어그램 ↔ 문서 보기` 처럼 안에서 무엇을 보여 줄지
      // 바뀌는 것을 잡으려면 그 자식들을 함께 봐야 한다.
      const scroller = mainScroller(doc);
      if (!scroller) return;
      observer.observe(scroller);
      for (const child of scroller.children) observer.observe(child);
    };

    frame.addEventListener("load", attach);
    if (frame.contentDocument?.readyState === "complete") attach();
    // 폭이 바뀌면 SVG 높이도 함께 바뀐다.
    window.addEventListener("resize", measure);

    return () => {
      frame.removeEventListener("load", attach);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [measure, src]);

  if (!selected) return null;

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
        <iframe
          key={selected.artifactId}
          ref={frameRef}
          src={src}
          title={`${diagram.title} ${selected.label}`}
          className="block w-full border-0"
          style={{ height }}
        />
      </section>
      <p className="mt-2 text-right">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap text-xs text-[#6d665e] underline underline-offset-4"
        >
          새 창에서 보기 ↗
        </a>
      </p>

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

/**
 * 도면 문서가 본문으로 쓰는 스크롤 영역을 찾는다.
 *
 * 크기로 거른다 — 프레임 폭·높이의 절반을 넘는 것만 본문으로 본다. 도면
 * 옆에 뜨는 설명 패널(01-ia 의 `.info`)도 스크롤하지만 그건 프레임 높이를
 * 정할 근거가 아니다. 스크롤 영역이 없는 문서(자연 높이로 흐르는 유저
 * 저니 등)는 undefined 를 돌려 프레임을 그대로 둔다.
 */
function mainScroller(doc: Document): HTMLElement | undefined {
  const root = doc.documentElement;
  let best: HTMLElement | undefined;

  for (const el of doc.body.querySelectorAll<HTMLElement>("*")) {
    if (el.clientHeight < root.clientHeight / 2) continue;
    if (el.clientWidth < root.clientWidth / 2) continue;
    const overflowY = doc.defaultView?.getComputedStyle(el).overflowY;
    if (overflowY !== "auto" && overflowY !== "scroll") continue;
    if (!best || el.clientHeight > best.clientHeight) best = el;
  }

  return best;
}
