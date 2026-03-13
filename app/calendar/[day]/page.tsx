import { CalendarDayView } from "@/components/calendar/CalendarDayView";
import { CurrentDiaryHeader } from "@/components/calendar/CurrentDiaryHeader";

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

export default async function CalendarDayPage({ params }: Props) {
  const { day } = await params;
  const label = formatDayLabel(day);

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50">
      <main className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="flex flex-col gap-1">
          <CurrentDiaryHeader />
          <p className="text-xs text-zinc-500">
            <span>Entry for </span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </span>
          </p>
        </header>
        <CalendarDayView day={day} />
      </main>
    </div>
  );
}

