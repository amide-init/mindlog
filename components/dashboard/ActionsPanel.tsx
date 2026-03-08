"use client";

export function ActionsPanel() {
  return (
    <aside className="flex h-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        Actions
      </h2>
      <button className="h-9 rounded-md bg-zinc-100 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700">
        Save locally
      </button>
      <button className="h-9 rounded-md border border-dashed border-zinc-400 text-xs font-medium text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-200">
        Run AI insight (coming soon)
      </button>
      <div className="mt-1 rounded-md border border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-600 dark:border-zinc-800/70 dark:bg-zinc-950/80 dark:text-zinc-500">
        This panel is a placeholder for diary actions, AI summaries, and export
        tools that we will add later.
      </div>
    </aside>
  );
}

