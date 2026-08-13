"use client";

import { useEffect, useState } from "react";

/**
 * Three-state theme control: system → light → dark → system.
 *
 * The resolved value is always written to `data-theme`, so CSS only ever has to
 * read the attribute. That also means "system" needs a live listener — once we
 * stamp `data-theme="light"` for a light OS, the `prefers-color-scheme` block
 * can no longer notice the OS flipping on its own.
 */

export type ThemeChoice = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Runs before first paint, inlined in <head>. Keep it tiny and defensive. */
export const themeInitScript = `
try {
  var c = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  var dark = c === "dark" || (c !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
} catch (e) {}
`.trim();

function apply(choice: ThemeChoice) {
  const dark =
    choice === "dark" ||
    (choice === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ThemeChoice, string> = {
  system: "시스템 설정",
  light: "라이트",
  dark: "다크",
};

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");
  // The server cannot know the stored choice, so the icon is only meaningful
  // after mount. Rendering a fixed-size placeholder keeps the header stable.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    setChoice(stored === "light" || stored === "dark" ? stored : "system");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    apply(choice);
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);

    if (choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [choice, mounted]);

  return (
    <button
      type="button"
      onClick={() => setChoice(NEXT[choice])}
      className="flex size-8 shrink-0 items-center justify-center rounded-pill border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
      aria-label={
        mounted ? `테마: ${LABEL[choice]} — 눌러서 ${LABEL[NEXT[choice]]}로` : "테마 전환"
      }
      title={mounted ? `테마: ${LABEL[choice]}` : undefined}
    >
      <span aria-hidden className="block size-[1.05rem]">
        {mounted ? ICONS[choice] : null}
      </span>
    </button>
  );
}

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "size-full",
};

const ICONS: Record<ThemeChoice, React.ReactNode> = {
  system: (
    <svg {...svgProps}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  light: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  dark: (
    <svg {...svgProps}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
};
