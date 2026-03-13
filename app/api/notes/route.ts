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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");
    const diaryId = searchParams.get("diaryId");

    if (!diaryId) {
      return NextResponse.json(
        { error: "Query param `diaryId` is required" },
        { status: 400 },
      );
    }
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return NextResponse.json(
        { error: "Query param `day` (YYYY-MM-DD) is required" },
        { status: 400 },
      );
    }

    const note = await prisma.note.findUnique({
      where: {
        diary_day_unique: {
          diaryId,
          day,
        },
      },
    });

    if (!note) {
      return NextResponse.json({ note: null }, { status: 200 });
    }

    return NextResponse.json({ note }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/notes] error", error);
    return NextResponse.json(
      { error: "Failed to load note" },
      { status: 500 },
    );
  }
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
    const content = body.content ?? {};

    const diaryId = body.diaryId;
    if (!diaryId || typeof diaryId !== "string") {
      return NextResponse.json(
        { error: "`diaryId` is required" },
        { status: 400 },
      );
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
        content,
      },
      update: {
        content,
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
    const message =
      error instanceof Error ? error.message : "Failed to save note for day";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

