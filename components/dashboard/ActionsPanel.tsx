"use client";

export function ActionsPanel() {
  return (
    <aside className="flex h-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        Actions
      </h2>
      <div className="mt-1 rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-500 dark:border-zinc-800/70 dark:bg-zinc-950/80 dark:text-zinc-500">
        This panel is reserved for future dashboard actions.
      </div>
    </aside>
  );
}

