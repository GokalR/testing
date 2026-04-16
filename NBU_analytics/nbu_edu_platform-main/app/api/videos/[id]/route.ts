import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("[GET /api/videos/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
  }
}

interface UpdateVideoBody {
  course_id?: string;
  title?: string;
  description?: string;
  video_url?: string;
  thumbnail_url?: string;
  duration_sec?: number;
  transcript?: string;
  sort_order?: number;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = (await req.json()) as UpdateVideoBody;

    const [updated] = await db
      .update(videos)
      .set({
        ...(body.course_id !== undefined && { courseId: body.course_id }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.video_url !== undefined && { videoUrl: body.video_url }),
        ...(body.thumbnail_url !== undefined && { thumbnailUrl: body.thumbnail_url }),
        ...(body.duration_sec !== undefined && { durationSec: body.duration_sec }),
        ...(body.transcript !== undefined && { transcript: body.transcript }),
        ...(body.sort_order !== undefined && { sortOrder: body.sort_order }),
      })
      .where(eq(videos.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/videos/[id]]", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;

    await db.delete(videos).where(eq(videos.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/videos/[id]]", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
