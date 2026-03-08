import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800/70 dark:bg-zinc-950/80 dark:shadow-[0_0_0_1px_rgba(24,24,27,0.8)]">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          MindLog
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Local-first developer diary.
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Start a scratchpad for your day, capture notes in a luxe-edit editor,
          and layer AI on top later.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-100 px-4 text-xs font-medium text-zinc-950 transition hover:bg-zinc-200 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Open dashboard
          </Link>
          <span className="inline-flex h-9 items-center rounded-md border border-zinc-300 px-3 text-[11px] text-zinc-500 dark:border-zinc-800/80">
            v0.1 · WIP UI
          </span>
        </div>
      </div>
    </main>
  );
}
