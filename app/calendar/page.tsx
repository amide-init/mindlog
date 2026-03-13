import { MonthlyCalendar } from "@/components/calendar/MonthlyCalendar";

export default function CalendarPage() {
  return (
    <main className="flex min-h-[calc(100vh-3rem)] w-full flex-1 justify-center bg-zinc-100 px-4 py-4 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50 sm:px-6 lg:px-8 lg:py-6">
      <div className="flex w-full max-w-4xl flex-col gap-4">
        <header className="text-xs text-zinc-500">
          <span>Calendar</span>
        </header>
        <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
          <MonthlyCalendar />
          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-4 text-xs text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-300">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Selected day
            </h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              This view will later show which days have notes and let you jump
              directly into that day&apos;s entry.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

