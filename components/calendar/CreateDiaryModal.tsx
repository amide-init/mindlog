"use client";

import { useState } from "react";

const STORAGE_KEY = "mindlog-current-diary-id";

export type Diary = { id: string; name: string; createdAt: string };

type CreateDiaryModalProps = {
  onCreated: (diary: Diary) => void;
};

export function CreateDiaryModal({ onCreated }: CreateDiaryModalProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/diaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "My diary" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to create diary");
        return;
      }
      if (data.diary) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, data.diary.id);
        }
        onCreated(data.diary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create diary");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-diary-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <h2
          id="create-diary-title"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Create your first diary
        </h2>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          Diaries hold your calendar and daily notes. Name it and get started.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label htmlFor="diary-name" className="sr-only">
            Diary name
          </label>
          <input
            id="diary-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Personal, Work"
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            autoFocus
            disabled={submitting}
          />
          {error && (
            <p className="text-[11px] text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Creating…" : "Create diary"}
          </button>
        </form>
      </div>
    </div>
  );
}

export { STORAGE_KEY };
