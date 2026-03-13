"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CreateDiaryModal,
  STORAGE_KEY,
  type Diary,
} from "./CreateDiaryModal";

type DiaryContextValue = {
  diaryId: string | null;
  diaries: Diary[];
  setDiaryId: (id: string) => void;
  refetchDiaries: () => Promise<void>;
  isLoading: boolean;
};

const DiaryContext = createContext<DiaryContextValue | null>(null);

export function useDiary() {
  const ctx = useContext(DiaryContext);
  if (!ctx) {
    throw new Error("useDiary must be used within DiaryProvider");
  }
  return ctx;
}

type DiaryProviderProps = {
  children: React.ReactNode;
};

export function DiaryProvider({ children }: DiaryProviderProps) {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [diaryId, setDiaryIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchDiaries = useCallback(async () => {
    try {
      const res = await fetch("/api/diaries");
      const data = await res.json();
      if (res.ok && Array.isArray(data.diaries)) {
        setDiaries(data.diaries);
        const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
        const current = data.diaries.find((d: Diary) => d.id === stored) ?? data.diaries[0];
        if (current) {
          setDiaryIdState(current.id);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, current.id);
          }
        } else {
          setDiaryIdState(null);
        }
      }
    } catch {
      setDiaries([]);
      setDiaryIdState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchDiaries();
  }, [refetchDiaries]);

  const setDiaryId = useCallback((id: string) => {
    setDiaryIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  }, []);

  const handleCreated = useCallback(
    (diary: Diary) => {
      setDiaries((prev) => [...prev, diary]);
      setDiaryIdState(diary.id);
    },
    [],
  );

  const value: DiaryContextValue = {
    diaryId,
    diaries,
    setDiaryId,
    refetchDiaries,
    isLoading,
  };

  return (
    <DiaryContext.Provider value={value}>
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
          Loading…
        </div>
      ) : diaries.length === 0 ? (
        <CreateDiaryModal onCreated={handleCreated} />
      ) : (
        children
      )}
    </DiaryContext.Provider>
  );
}
