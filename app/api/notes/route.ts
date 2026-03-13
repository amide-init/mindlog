import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ThemeSafeJson = unknown;

function getTodayISO(dateStr?: string) {
  if (dateStr) {
    // Expecting "YYYY-MM-DD" from client
    return dateStr;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function getOrCreateDefaultDiary() {
  const name = "personal";
  const existing = await prisma.diary.findFirst({
    where: { name },
  });
  if (existing) return existing;
  return prisma.diary.create({
    data: { name },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      content: ThemeSafeJson;
      day?: string;
      diaryId?: string;
    };

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    if (body.content === undefined) {
      return NextResponse.json(
        { error: "`content` (JSON) is required" },
        { status: 400 },
      );
    }

    const day = getTodayISO(body.day);

    let diaryId = body.diaryId;
    if (!diaryId) {
      const diary = await getOrCreateDefaultDiary();
      diaryId = diary.id;
    }

    const note = await prisma.note.upsert({
      where: {
        diary_day_unique: {
          diaryId,
          day,
        },
      },
      create: {
        diaryId,
        day,
        content: body.content,
      },
      update: {
        content: body.content,
      },
    });

    return NextResponse.json(
      {
        note,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[POST /api/notes] error", error);
    return NextResponse.json(
      { error: "Failed to save note for day" },
      { status: 500 },
    );
  }
}

