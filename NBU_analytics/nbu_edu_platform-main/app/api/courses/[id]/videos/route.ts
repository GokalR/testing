import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, videos } from "@/lib/db/schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify course exists and is published
    const [course] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(and(eq(courses.id, id), eq(courses.isPublished, true)))
      .limit(1);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Return videos without transcript (transcript can be large)
    const courseVideos = await db
      .select({
        id: videos.id,
        courseId: videos.courseId,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        durationSec: videos.durationSec,
        sortOrder: videos.sortOrder,
        videoUrl: videos.videoUrl,
      })
      .from(videos)
      .where(eq(videos.courseId, id))
      .orderBy(videos.sortOrder);

    return NextResponse.json({ videos: courseVideos });
  } catch (error) {
    console.error("[GET /api/courses/[id]/videos]", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
