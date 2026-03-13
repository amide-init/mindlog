export default function DashboardPage() {
  return (
    <main className="flex min-h-[calc(100vh-3rem)] w-full items-center justify-center bg-zinc-100 px-4 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400">
        Dashboard is currently empty. Use the calendar or a day entry view to
        write notes.
      </div>
    </main>
  );
}
