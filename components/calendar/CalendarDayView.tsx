"use client";

import { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!diaryId) return;
    let cancelled = false;

    // Reset state when day or diary changes so the editor remounts
    setInitialLoaded(false);
    setContent(undefined);

    async function load() {
      try {
        const res = await fetch(
          `/api/notes?day=${encodeURIComponent(day)}&diaryId=${encodeURIComponent(diaryId)}`,
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
    <section className="flex flex-1 flex-col gap-4 md:flex-row">
      <div className="min-w-0 flex-1">
        <EditorPanel
          key={`${day}-${diaryId ?? "none"}`}
          initialJSON={initialLoaded ? content : undefined}
          onChange={setContent}
        />
      </div>
      <div className="w-full shrink-0 md:w-80">
        <ActionsPanel
          onSave={handleSave}
          saving={saving}
          saveError={saveError}
        />
      </div>
    </section>
  );
}
