/**
 * The monospace uppercase eyebrow that opens every page on both cloned sites —
 * PokeClip set it in wide-tracked mono, FillMap prefixed it with an accent dot.
 * Both here.
 */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
      <span
        aria-hidden
        className="inline-block size-[0.4375rem] shrink-0 rounded-pill bg-primary"
      />
      {children}
    </p>
  );
}
