import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-helpers";

interface CreateVideoBody {
  course_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration_sec?: number;
  transcript?: string;
  sort_order?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = (await req.json()) as CreateVideoBody;

    if (!body.course_id || typeof body.course_id !== "string" || !body.course_id.trim()) {
      return NextResponse.json({ error: "course_id is required" }, { status: 400 });
    }
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!body.video_url || typeof body.video_url !== "string" || !body.video_url.trim()) {
      return NextResponse.json({ error: "video_url is required" }, { status: 400 });
    }

    const [created] = await db
      .insert(videos)
      .values({
        courseId: body.course_id.trim(),
        title: body.title.trim(),
        description: body.description,
        videoUrl: body.video_url.trim(),
        thumbnailUrl: body.thumbnail_url,
        durationSec: body.duration_sec,
        transcript: body.transcript,
        sortOrder: body.sort_order ?? 0,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/videos]", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
