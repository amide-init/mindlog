"use client";

import type React from "react";
import { DiaryProvider } from "@/components/calendar/DiaryContext";
import { Navbar } from "@/components/Navbar";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <DiaryProvider>
      <Navbar />
      {children}
      <footer className="border-t border-zinc-200 bg-white/90 text-zinc-600 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/80 dark:text-zinc-400">
        <div className="flex h-10 w-full items-center justify-between px-4 text-xs sm:px-6">
          <span>
            MindLog{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              v{process.env.NEXT_PUBLIC_APP_VERSION ?? "dev"}
            </span>
          </span>
          <span className="text-[11px]">Local-first</span>
        </div>
      </footer>
    </DiaryProvider>
  );
}

