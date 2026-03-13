"use client";

import { useCallback, useEffect, useState } from "react";
import { ActionsPanel } from "@/components/dashboard/ActionsPanel";
import { EditorPanel } from "@/components/dashboard/EditorPanel";

type CalendarDayViewProps = {
  day: string;
};

export function CalendarDayView({ day }: CalendarDayViewProps) {
  const [content, setContent] = useState<unknown>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/notes?day=${encodeURIComponent(day)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.note?.content != null) {
          setContent(data.note.content);
        }
      } catch {
        if (!cancelled) setContent(null);
      } finally {
        if (!cancelled) setInitialLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [day]);

  const handleSave = useCallback(async () => {
    setSaveError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content ?? {},
          day,
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
  }, [content, day]);

  return (
    <section className="flex flex-1 flex-col gap-4 md:flex-row">
      <div className="min-w-0 flex-1">
        <EditorPanel
          key={`${day}-${initialLoaded}`}
          initialJSON={initialLoaded ? content ?? undefined : undefined}
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
