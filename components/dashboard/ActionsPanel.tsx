"use client";

type ActionsPanelProps = {
  onSave?: () => void;
  saving?: boolean;
  saveError?: string | null;
};

export function ActionsPanel({
  onSave,
  saving,
  saveError,
}: ActionsPanelProps) {
  return (
    <aside className="flex h-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
        Actions
      </h2>
      {onSave && (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-9 rounded-md bg-zinc-900 px-3 text-xs font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saveError && (
            <p className="text-[11px] text-red-600 dark:text-red-400">
              {saveError}
            </p>
          )}
        </>
      )}
      <div className="mt-1 rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-2 text-[11px] text-zinc-500 dark:border-zinc-800/70 dark:bg-zinc-950/80 dark:text-zinc-500">
        {onSave
          ? "Save stores this day’s note in your local database."
          : "This panel is reserved for future dashboard actions."}
      </div>
    </aside>
  );
}

