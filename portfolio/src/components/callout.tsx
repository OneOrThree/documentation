/**
 * FillMap's accent-railed `요약` aside, kept as the standard opening of a
 * document and also exposed to MDX so a body can raise a caveat mid-page.
 */
export function Callout({
  label = "요약",
  tone = "primary",
  children,
}: {
  label?: string;
  tone?: "primary" | "warn";
  children: React.ReactNode;
}) {
  const rail = tone === "warn" ? "border-l-warn" : "border-l-primary";

  return (
    <aside
      className={`rounded-r-card border-l-[3px] bg-surface-2 px-4 py-3.5 ${rail}`}
    >
      <p className="mb-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <div className="text-[0.9375rem] leading-relaxed text-foreground [&>*+*]:mt-2">
        {children}
      </div>
    </aside>
  );
}
