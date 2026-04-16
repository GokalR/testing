import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { videos, progress } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";

interface VideoProgressBody {
  video_id: string;
  watched_sec: number;
  last_position: number;
}

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = (await req.json()) as VideoProgressBody;
    const { video_id, watched_sec, last_position } = body;

    if (!video_id || watched_sec === undefined || last_position === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: video_id, watched_sec, last_position" },
        { status: 400 }
      );
    }

    // Fetch video to determine completion threshold
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, video_id))
      .limit(1);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const completed =
      video.durationSec !== null && video.durationSec > 0
        ? watched_sec / video.durationSec >= 0.9
        : false;

    const userId = session!.user.id;

    // Check for existing video progress record for this user+video
    const [existing] = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.videoId, video_id),
          eq(progress.progressType, "video")
        )
      )
      .limit(1);

    const data = { watched_sec, last_position, completed };

    let result;
    if (existing) {
      const [updated] = await db
        .update(progress)
        .set({ data, updatedAt: new Date() })
        .where(eq(progress.id, existing.id))
        .returning();
      result = updated;
    } else {
      const [inserted] = await db
        .insert(progress)
        .values({
          userId,
          videoId: video_id,
          contentId: null,
          progressType: "video",
          data,
        })
        .returning();
      result = inserted;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/progress/video]", error);
    return NextResponse.json(
      { error: "Failed to save video progress" },
      { status: 500 }
    );
  }
}
