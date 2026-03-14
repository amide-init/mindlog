"use client";

import { use, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDayView } from "@/components/calendar/CalendarDayView";
import { CurrentDiaryHeader } from "@/components/calendar/CurrentDiaryHeader";
import { useDiary } from "@/components/calendar/DiaryContext";

type Props = {
  params: Promise<{ day: string }>;
};

function formatDayLabel(day: string | undefined) {
  if (day == null || typeof day !== "string") return "Unknown date";
  const parts = day.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map((p) => Number.parseInt(p, 10));
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
      const date = new Date(y, m - 1, d);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    }
  }
  return day;
}

export default function CalendarDayPage({ params }: Props) {
  const { day } = use(params);
  const label = useMemo(() => formatDayLabel(day), [day]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlDiaryId = searchParams.get("diaryId");
  const { diaryId, setDiaryId } = useDiary();

  const hasSyncedFromUrl = useRef(false);

  // On first render only:
  // - If URL has diaryId, override context once.
  // - If URL has no diaryId, mark as synced so future changes can write it.
  useEffect(() => {
    if (hasSyncedFromUrl.current) return;

    if (!urlDiaryId) {
      hasSyncedFromUrl.current = true;
      return;
    }

    if (urlDiaryId === diaryId) {
      hasSyncedFromUrl.current = true;
      return;
    }

    setDiaryId(urlDiaryId);
    hasSyncedFromUrl.current = true;
  }, [urlDiaryId, diaryId, setDiaryId]);

  // After initial sync, keep URL in sync when user changes diary from navbar.
  useEffect(() => {
    if (!day) return;
    if (!diaryId) return;
    if (!hasSyncedFromUrl.current) return;

    const current = new URLSearchParams(searchParams.toString());
    if (current.get("diaryId") === diaryId) return;

    current.set("diaryId", diaryId);
    router.replace(`/calendar/${day}?${current.toString()}`);
  }, [day, diaryId, router, searchParams]);

  const navigateToDay = useCallback(
    (nextDay: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const diaryParam = params.get("diaryId");
      const qs = diaryParam
        ? `?diaryId=${encodeURIComponent(diaryParam)}`
        : "";
      router.push(`/calendar/${nextDay}${qs}`);
    },
    [router, searchParams],
  );

  const goOffset = useCallback(
    (offset: number) => {
      if (!day) return;
      const [y, m, d] = day.split("-").map((p) => Number.parseInt(p, 10));
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + offset);
      const next = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");
      navigateToDay(next);
    },
    [day, navigateToDay],
  );

  const goToday = useCallback(() => {
    const now = new Date();
    const todayStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
    navigateToDay(todayStr);
  }, [navigateToDay]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50">
      <main className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CurrentDiaryHeader />
            <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Entry for</span>
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-800 shadow-sm transition dark:border-red-500/60 dark:bg-red-900/40 dark:text-red-200">
                {label}
              </span>
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1.5 sm:mt-0">
            <button
              type="button"
              onClick={() => goOffset(-1)}
              className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={goToday}
              className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => goOffset(1)}
              className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              Next →
            </button>
          </div>
        </header>
        <CalendarDayView day={day} />
      </main>
    </div>
  );
}

