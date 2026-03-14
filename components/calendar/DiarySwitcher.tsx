"use client";

import { useState } from "react";
import { useDiary } from "@/components/calendar/DiaryContext";
import { CreateDiaryModal } from "@/components/calendar/CreateDiaryModal";

const NEW_DIARY_VALUE = "__new_diary__";

export function DiarySwitcher() {
  const { diaryId, diaries, setDiaryId, refetchDiaries } = useDiary();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!diaryId || diaries.length === 0) {
    return null;
  }

  return (
    <>
      <select
        value={diaryId}
        onChange={(e) => {
          const value = e.target.value;
          if (value === NEW_DIARY_VALUE) {
            setShowCreateModal(true);
          } else {
            setDiaryId(value);
          }
        }}
        className="rounded border border-zinc-200 bg-transparent px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:focus:ring-zinc-500"
        aria-label="Select diary"
      >
        {diaries.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
        <option value={NEW_DIARY_VALUE}>＋ Create new diary…</option>
      </select>
      {showCreateModal && (
        <CreateDiaryModal
          onCreated={async (diary) => {
            setShowCreateModal(false);
            setDiaryId(diary.id);
            await refetchDiaries();
          }}
        />
      )}
    </>
  );
}

