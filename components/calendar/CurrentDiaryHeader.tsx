"use client";

import { useDiary } from "@/components/calendar/DiaryContext";

export function CurrentDiaryHeader() {
  const { diaryId, diaries } = useDiary();
  const current = diaries.find((d) => d.id === diaryId);

  if (!current) return null;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {current.name}
      </h1>
    </div>
  );
}
