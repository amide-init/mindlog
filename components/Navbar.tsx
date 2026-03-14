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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

