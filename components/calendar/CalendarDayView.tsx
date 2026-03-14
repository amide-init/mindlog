"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionsPanel } from "@/components/dashboard/ActionsPanel";
import { EditorPanel } from "@/components/dashboard/EditorPanel";
import { useDiary } from "@/components/calendar/DiaryContext";

type CalendarDayViewProps = {
  day: string;
};

export function CalendarDayView({ day }: CalendarDayViewProps) {
  const { diaryId } = useDiary();
  const [content, setContent] = useState<unknown>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());
  const [timeZone, setTimeZone] = useState<string>(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("mindlog-timezone");
    if (stored) {
      setTimeZone(stored);
    }

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ timeZone?: string }>).detail;
      if (detail?.timeZone) {
        setTimeZone(detail.timeZone);
      }
    };

    window.addEventListener("mindlog-timezone-change", handler);
    return () => window.removeEventListener("mindlog-timezone-change", handler);
  }, []);

  // Tick every second so the clock stays fresh
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { dateLabel, timeLabel, timeZoneLabel } = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat(undefined, {
        timeZone,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      });
      const parts = formatter.formatToParts(now);
      const tzPart = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

      const datePart = new Intl.DateTimeFormat(undefined, {
        timeZone,
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(now);

      const timePart = new Intl.DateTimeFormat(undefined, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      return {
        dateLabel: datePart,
        timeLabel: timePart,
        timeZoneLabel: tzPart,
      };
    } catch {
      return {
        dateLabel: now.toLocaleDateString(),
        timeLabel: now.toLocaleTimeString(),
        timeZoneLabel: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }
  }, [now, timeZone]);

  useEffect(() => {
    if (!diaryId) return;
    let cancelled = false;

    // Reset state when day or diary changes so the editor remounts
    setInitialLoaded(false);
    setContent(undefined);

    async function load() {
      try {
        const res = await fetch(
          `/api/notes?day=${encodeURIComponent(day)}&diaryId=${encodeURIComponent(
            diaryId as string,
          )}`,
        );
        const data = await res.json();
        if (cancelled) return;
        // Set content to the note's content, or leave undefined for an empty editor
        setContent(data.note?.content ?? undefined);
      } catch {
        if (!cancelled) setContent(undefined);
      } finally {
        if (!cancelled) setInitialLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [day, diaryId]);

  const handleSave = useCallback(async () => {
    if (!diaryId) return;
    setSaveError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content ?? {},
          day,
          diaryId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(data.error ?? `Failed to save (${res.status})`);
        return;
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [content, day, diaryId]);

  return (
    <>
      <section className="flex flex-1 flex-col gap-4 md:flex-row">
        <div className="min-w-0 flex-1">
          {initialLoaded ? (
            <EditorPanel
              key={`${day}-${diaryId ?? "none"}`}
              initialJSON={content ?? undefined}
              namespaceSuffix={diaryId ? `${day}-${diaryId}` : day}
              onChange={setContent}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">
              Loading…
            </div>
          )}
        </div>
        <div className="w-full shrink-0 md:w-80">
          <ActionsPanel
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
          />
        </div>
      </section>

      <section className="pointer-events-none fixed bottom-4 right-4 z-40 max-w-xs rounded-xl border border-zinc-200 bg-white/90 p-3 text-xs text-zinc-700 shadow-lg backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/90 dark:text-zinc-200">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          <span className="pointer-events-auto inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-300">
            Now
          </span>
          {timeZoneLabel && (
            <span className="pointer-events-auto font-medium text-zinc-500 dark:text-zinc-400">
              {timeZoneLabel}
            </span>
          )}
        </div>
        <div className="mt-2 text-center">
          <p className="inline-block rounded-lg border border-zinc-200 bg-white px-4 py-2 text-3xl font-semibold leading-tight text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
            {timeLabel}
          </p>
          <p className="mt-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-200">
            {dateLabel}
          </p>
        </div>
      </section>
    </>
  );
}
