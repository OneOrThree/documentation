"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { sections, site } from "@root/site.config";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * The one and only copy of the site chrome.
 *
 * Both clones re-emitted this header — brand, nav array, active-item styling —
 * at the top of every single `page.tsx`, ~30 times each, with the current item
 * hand-flipped from a link to a button. Here `usePathname` decides it once.
 */

const NAV = [
  { href: "/", label: "개요" },
  ...sections.map((s) => ({ href: `/${s.slug}`, label: s.label })),
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[3.8125rem] max-w-6xl items-center gap-4 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2 no-underline"
          aria-label={`${site.wordmark} 홈`}
        >
          <span className="text-[0.95rem] font-bold tracking-[-0.01em] text-foreground">
            {site.wordmark}
          </span>
          <span className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted">
            {site.subLabel}
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-pill px-3 py-1.5 text-[0.8125rem] no-underline transition-colors ${
                      active
                        ? "bg-surface-3 font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
