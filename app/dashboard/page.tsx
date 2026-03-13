import { ActionsPanel } from "@/components/dashboard/ActionsPanel";
import { EditorPanel } from "@/components/dashboard/EditorPanel";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-100 text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#18181b,_#020617)] dark:text-zinc-50">
      <main className="flex w-full flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="text-xs text-zinc-500">Dashboard</div>
        <section className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="min-w-0 flex-1">
            <EditorPanel />
          </div>
          <div className="w-full shrink-0 md:w-80">
            <ActionsPanel />
          </div>
        </section>
      </main>
    </div>
  );
}

