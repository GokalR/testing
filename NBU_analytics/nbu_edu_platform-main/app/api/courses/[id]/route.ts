import { NextRequest, NextResponse } from "next/server";
import { eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, videos } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch course
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .limit(1);

    if (!course || !course.isPublished) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Fetch videos ordered by sort_order
    const courseVideos = await db
      .select()
      .from(videos)
      .where(eq(videos.courseId, id))
      .orderBy(videos.sortOrder);

    // Get video count
    const [{ total }] = await db
      .select({ total: count() })
      .from(videos)
      .where(eq(videos.courseId, id));

    return NextResponse.json({
      ...course,
      videos: courseVideos,
      videoCount: Number(total),
    });
  } catch (error) {
    console.error("[GET /api/courses/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

interface UpdateCourseBody {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  educator_name?: string;
  is_published?: boolean;
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
    const body = (await req.json()) as UpdateCourseBody;

    const [updated] = await db
      .update(courses)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.thumbnail_url !== undefined && { thumbnailUrl: body.thumbnail_url }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.educator_name !== undefined && { educatorName: body.educator_name }),
        ...(body.is_published !== undefined && { isPublished: body.is_published }),
        ...(body.sort_order !== undefined && { sortOrder: body.sort_order }),
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/courses/[id]]", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
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

    await db.delete(courses).where(eq(courses.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/courses/[id]]", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
