/**
 * Status is free text in frontmatter (유효 / 검토됨 / 대체됨 → ADR-004 / …) so a
 * new project can invent its own vocabulary. Only the colour is inferred, and
 * only for words we recognise — anything else gets the neutral treatment rather
 * than a wrong signal.
 */
const TONES = {
  ok: "border-ok/35 text-ok",
  warn: "border-warn/40 text-warn",
  danger: "border-danger/35 text-danger",
  info: "border-info/35 text-info",
  neutral: "border-border text-muted-foreground",
} as const;

type Tone = keyof typeof TONES;

const KEYWORDS: [RegExp, Tone][] = [
  [/^(유효|채택|확정|완료|active|accepted)/i, "ok"],
  [/^(검토|제안|초안|draft|proposed|review)/i, "info"],
  [/^(진행|작성 예정|보류|wip|pending)/i, "warn"],
  [/^(대체|폐기|반려|중단|superseded|deprecated|rejected)/i, "danger"],
];

function toneFor(status: string): Tone {
  return KEYWORDS.find(([re]) => re.test(status.trim()))?.[1] ?? "neutral";
}

export function StatusPill({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-pill border px-2 py-[0.15rem] font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] ${TONES[toneFor(status)]} ${className}`}
    >
      {status}
    </span>
  );
}
