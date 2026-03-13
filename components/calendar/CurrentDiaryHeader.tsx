"use client";

import { useDiary } from "@/components/calendar/DiaryContext";

export function CurrentDiaryHeader() {
  const { diaryId, diaries, setDiaryId } = useDiary();
  const current = diaries.find((d) => d.id === diaryId);

  if (!current) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span>Calendar</span>
      <span aria-hidden className="text-zinc-400 dark:text-zinc-500">
        ·
      </span>
      {diaries.length > 1 ? (
        <select
          value={diaryId}
          onChange={(e) => setDiaryId(e.target.value)}
          className="rounded border border-zinc-200 bg-transparent px-1.5 py-0.5 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:focus:ring-zinc-500"
          aria-label="Select diary"
        >
          {diaries.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      ) : (
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {current.name}
        </span>
      )}
    </div>
  );
}
