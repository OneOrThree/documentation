import type { DiagramEntry } from "@/lib/diagrams";

/** 검토한 HTML의 스타일과 인터랙션을 독립된 프레임에서 유지합니다. */
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

  return (
    <>
      <div className="mb-5">{selector}</div>
      <section className="overflow-hidden rounded-card border border-border bg-white text-[#302e2a]">
        <div className="flex items-center justify-between gap-3 border-b border-[#e5e2dc] px-5 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-sm font-bold">
              {index} · {diagram.title}
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
            className="shrink-0 text-xs text-[#6d665e] underline underline-offset-4"
          >
            새 창에서 보기 ↗
          </a>
        </div>
        <iframe
          src={src}
          title={diagram.title}
          className="block h-[680px] w-full border-0 max-sm:h-[650px]"
        />
      </section>
    </>
  );
}
