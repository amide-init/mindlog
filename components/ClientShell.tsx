"use client";

import type React from "react";
import { DiaryProvider } from "@/components/calendar/DiaryContext";
import { Navbar } from "@/components/Navbar";

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <DiaryProvider>
      <Navbar />
      {children}
    </DiaryProvider>
  );
}

