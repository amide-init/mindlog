"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDiary } from "@/components/calendar/DiaryContext";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CalendarCell = {
  day: number | null;
  dateKey: string | null;
};

function buildMonth(year: number, monthIndex: number): CalendarCell[] {
  // monthIndex: 0–11
  const firstOfMonth = new Date(year, monthIndex, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // convert Sun=0 -> 6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: null, dateKey: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const yearStr = String(year);
    const monthStr = String(monthIndex + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    cells.push({
      day: d,
      dateKey: `${yearStr}-${monthStr}-${dayStr}`,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateKey: null });
  }
  return cells;
}

export function MonthlyCalendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));

  const cells = useMemo(
    () => buildMonth(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  const monthLabel = useMemo(() => {
    return new Date(cursor.year, cursor.month, 1).toLocaleDateString(
      undefined,
      { month: "long", year: "numeric" },
    );
  }, [cursor.year, cursor.month]);

  const todayKey = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [today]);

  const router = useRouter();
  const { diaryId } = useDiary();

  const goMonth = (delta: number) => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <section className="flex h-full flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-4 text-xs text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-300">
      <header className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Calendar
          </h1>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {monthLabel}
          </span>
        </div>
        <div className="inline-flex rounded-full border border-zinc-200 bg-white/80 text-[11px] shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goMonth(1)}
            className="border-l border-zinc-200 px-2 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            →
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        {WEEKDAYS.map((label) => (
          <div key={label} className="flex h-6 items-center justify-center">
            {label}
          </div>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-7 gap-1 text-[11px]">
        {cells.map((cell, idx) => {
          if (cell.day === null || !cell.dateKey) {
            return <div key={idx} className="h-8 rounded-md" />;
          }

          const isToday = cell.dateKey === todayKey;

          return (
            <button
              key={cell.dateKey}
              type="button"
              onClick={() => {
                if (!cell.dateKey) return;
                const base = `/calendar/${cell.dateKey}`;
                if (diaryId) {
                  router.push(`${base}?diaryId=${encodeURIComponent(diaryId)}`);
                } else {
                  router.push(base);
                }
              }}
              className={`flex h-8 items-center justify-center rounded-md border text-xs transition ${
                isToday
                  ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : "border-zinc-200 bg-white/80 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800/70 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}

