import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3rem)] w-full bg-zinc-50 text-zinc-900 dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,_#27272a,_transparent)] dark:bg-zinc-950 dark:text-zinc-50">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-16 sm:pb-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          MindLog
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          One note per day.
          <br />
          <span className="text-zinc-500 dark:text-zinc-400">
            Simple, local, yours.
          </span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A minimal diary that stores one document per day. Pick a date on the
          calendar, write in a rich editor, and keep everything on your machine.
          No account required—just open and start.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/calendar"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Open calendar
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50"
          >
            Dashboard
          </Link>
        </div>
      </section>

      {/* What it is */}
      <section className="border-t border-zinc-200 bg-white/60 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            What is MindLog?
          </h2>
          <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
            MindLog is a <strong className="font-medium text-zinc-900 dark:text-zinc-100">local-first diary</strong>.
            Your notes live in a database on your computer (SQLite). You get a
            calendar to jump to any day, a rich text editor for each day’s entry,
            and a simple dashboard. Everything stays on your machine until you
            decide otherwise.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Features
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            <li className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/70 dark:bg-zinc-900/50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base dark:bg-zinc-800 dark:text-zinc-300">
                📅
              </span>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  Calendar view
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  See your month at a glance and open any day to write or edit.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/70 dark:bg-zinc-900/50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base dark:bg-zinc-800 dark:text-zinc-300">
                📝
              </span>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  One doc per day
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Each date has a single note. No clutter—just one entry per day.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/70 dark:bg-zinc-900/50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base dark:bg-zinc-800 dark:text-zinc-300">
                ✨
              </span>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  Rich editor
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Format text, add links, and use headings with the built-in editor.
                </p>
              </div>
            </li>
            <li className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800/70 dark:bg-zinc-900/50">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-base dark:bg-zinc-800 dark:text-zinc-300">
                🔒
              </span>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  Local-first
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Data is stored on your machine. No sign-up, no cloud required.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Ready to start? Open the calendar and pick today—or any day.
          </p>
          <Link
            href="/calendar"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-zinc-50 transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to calendar
          </Link>
        </div>
      </section>
    </main>
  );
}
