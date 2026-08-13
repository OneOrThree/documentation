import { site } from "@root/site.config";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {site.footer}
        </p>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
          {site.wordmark} · {site.subLabel}
        </p>
      </div>
    </footer>
  );
}
