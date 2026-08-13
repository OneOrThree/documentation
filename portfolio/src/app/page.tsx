import Link from "next/link";

import { sections, site } from "@root/site.config";
import { getDocs } from "@/lib/content";
import { getDiagrams } from "@/lib/diagrams";
import { Kicker } from "@/components/kicker";

/**
 * Landing page. Structure is the one both clones converged on — hero, then a
 * numbered index of everything the site holds, then a strip of what it was
 * built with — except the index counts are read from `content/` instead of
 * being typed in by hand (PokeClip's had a row pointing at nothing).
 */
export default function HomePage() {
  const diagrams = getDiagrams();

  const index = sections.map((section) => ({
    ...section,
    count:
      section.kind === "diagrams" ? diagrams.length : getDocs(section.slug).length,
    unit: section.kind === "diagrams" ? "장" : "건",
  }));

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="border-b border-border py-20 sm:py-28">
        <Kicker>{site.hero.kicker}</Kicker>

        <h1 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
          {site.hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-5 text-lg font-semibold text-primary">{site.hero.subline}</p>

        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-muted-foreground">
          {site.hero.lede}
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {site.hero.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`rounded-pill px-5 py-2.5 text-sm font-semibold no-underline transition-all hover:-translate-y-px ${
                action.variant === "solid"
                  ? "bg-foreground text-background"
                  : "border border-border-strong text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16">
        <Kicker>ARTIFACT INDEX</Kicker>
        <h2 className="mt-4 text-2xl font-bold tracking-[-0.015em]">산출물 인덱스</h2>

        <ol className="mt-8 overflow-hidden rounded-card border border-border bg-surface-1">
          {index.map((entry, i) => (
            <li key={entry.slug} className="border-b border-border last:border-b-0">
              <Link
                href={`/${entry.slug}`}
                className="group grid grid-cols-[2.6rem_minmax(0,1fr)_auto] items-baseline gap-x-3 px-4 py-4 no-underline transition-colors hover:bg-surface-2 sm:px-5"
              >
                <span className="font-mono text-[0.8125rem] tabular-nums text-muted">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground group-hover:text-primary">
                    {entry.title}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {entry.description}
                  </span>
                </span>
                <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[0.6875rem] tabular-nums text-muted">
                  {entry.count}
                  {entry.unit}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border py-16">
        <Kicker>BUILT WITH</Kicker>
        <h2 className="mt-4 text-2xl font-bold tracking-[-0.015em]">무엇으로 만들었나</h2>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {site.stack.map((item) => (
            <li
              key={item.name}
              className="rounded-card border border-border bg-surface-1 px-4 py-2.5"
            >
              <span className="block font-mono text-[0.8125rem] font-semibold text-foreground">
                {item.name}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {item.role}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
