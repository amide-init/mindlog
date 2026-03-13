import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const diaries = await prisma.diary.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, createdAt: true },
    });
    return NextResponse.json({ diaries }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/diaries] error", error);
    return NextResponse.json(
      { error: "Failed to load diaries" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string };

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim() || "My diary" : "My diary";

    const diary = await prisma.diary.create({
      data: { name },
    });

    return NextResponse.json({ diary }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/diaries] error", error);
    const message =
      error instanceof Error ? error.message : "Failed to create diary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
