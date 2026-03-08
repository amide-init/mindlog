"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "mindlog-theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(
    new CustomEvent("mindlog-theme-change", { detail: { theme } }),
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial: Theme = prefersDark ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-7 items-center gap-1 rounded-full border border-zinc-200 bg-white/80 px-2 text-[11px] font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] text-zinc-50 dark:bg-amber-300 dark:text-zinc-900"
      >
        {isDark ? "☾" : "☼"}
      </span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

