/**
 * The diagram's own title line, sitting between the view toggle and the canvas:
 * a large accent number, the Korean title, then a small monospace English
 * label. Straight from both cloned sites.
 */
export function DiagramHeading({
  index,
  title,
  titleEn,
}: {
  index: number;
  title: string;
  titleEn?: string;
}) {
  return (
    <p className="flex min-w-0 items-baseline gap-2.5 font-bold">
      <span
        aria-hidden
        className="font-mono text-[1.625rem] leading-none text-primary"
      >
        {index}
      </span>
      <span className="text-[1.0625rem] tracking-[-0.01em] text-foreground">
        {title}
      </span>
      {titleEn && (
        <span className="font-mono text-xs font-medium uppercase tracking-[0.11em] text-muted">
          {titleEn}
        </span>
      )}
    </p>
  );
}
