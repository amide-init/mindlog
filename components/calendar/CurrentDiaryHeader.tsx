"use client";

import { useDiary } from "@/components/calendar/DiaryContext";

export function CurrentDiaryHeader() {
  const { diaryId, diaries } = useDiary();
  const current = diaries.find((d) => d.id === diaryId);

  if (!current) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
      <span>Calendar</span>
      <span aria-hidden className="text-zinc-400 dark:text-zinc-500">
        ·
      </span>
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {current.name}
      </span>
    </div>
  );
}
