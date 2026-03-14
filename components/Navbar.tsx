"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { DiarySwitcher } from "@/components/calendar/DiarySwitcher";

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 text-zinc-900 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/80 dark:text-zinc-50">
      <div className="flex h-12 w-full items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          MindLog
        </Link>
        <div className="flex items-center gap-3">
          <DiarySwitcher />
          <Link
            href="/settings"
            className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
          >
            Settings
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

