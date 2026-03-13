"use client";

import { DiaryProvider } from "@/components/calendar/DiaryContext";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DiaryProvider>{children}</DiaryProvider>;
}
