"use client";

import { useEffect, useMemo, useState } from "react";
import { useDiary } from "@/components/calendar/DiaryContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const TIMEZONE_STORAGE_KEY = "mindlog-timezone";

function getInitialTimeZone() {
  if (typeof window === "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  const stored = window.localStorage.getItem(TIMEZONE_STORAGE_KEY);
  if (stored) return stored;
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

type PendingDelete = { id: string; name: string } | null;

export default function SettingsPage() {
  const { diaries, diaryId, refetchDiaries } = useDiary();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const [timeZone, setTimeZone] = useState<string>(() => getInitialTimeZone());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TIMEZONE_STORAGE_KEY, timeZone);
    // Broadcast to any listeners (e.g. calendar page) if needed later
    window.dispatchEvent(
      new CustomEvent("mindlog-timezone-change", { detail: { timeZone } }),
    );
  }, [timeZone]);

  const sortedDiaries = useMemo(
    () =>
      [...diaries].sort((a, b) =>
        a.createdAt.localeCompare ? a.createdAt.localeCompare(b.createdAt) : 0,
      ),
    [diaries],
  );

  const openDeleteModal = (id: string, name: string) => {
    setPendingDelete({ id, name });
  };

  const closeDeleteModal = () => {
    if (!deletingId) setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id, name } = pendingDelete;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/diaries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error ?? "Failed to delete diary");
        return;
      }
      setPendingDelete(null);
      await refetchDiaries();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to delete diary. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3rem)] w-full justify-center bg-zinc-100 px-4 py-4 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50 sm:px-6 lg:px-8 lg:py-6">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage diaries and time zone preferences.
          </p>
        </header>

        <section className="space-y-3 rounded-xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-800 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-100">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Diaries
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Rename or delete diaries. Deleting a diary removes all its notes.
              </p>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {sortedDiaries.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No diaries yet. Create one from the main calendar page.
              </p>
            ) : (
              sortedDiaries.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {d.name}
                      {d.id === diaryId && (
                        <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                          Current
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      Created{" "}
                      {new Date(d.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(d.id, d.name)}
                    disabled={deletingId === d.id}
                    className="inline-flex h-7 items-center justify-center rounded-md border border-red-200 bg-red-50 px-2.5 text-[11px] font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/60 dark:bg-red-950/40 dark:text-red-200 dark:hover:border-red-400 dark:hover:bg-red-900/60"
                  >
                    {deletingId === d.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-800 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Time zone
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Choose which time zone to use for clocks and dates. Defaults to your system
            time zone.
          </p>
          <div className="mt-2 flex flex-col gap-2 text-xs">
            <label
              htmlFor="timezone-select"
              className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300"
            >
              Time zone
            </label>
            <select
              id="timezone-select"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="h-8 max-w-xs rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            >
              {[...new Set([timeZone, ...COMMON_TIMEZONES])].map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete diary"
        message={
          pendingDelete
            ? `Delete diary "${pendingDelete.name}" and all of its notes? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </main>
  );
}

