import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, enrollments } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const userId = session!.user.id;

    const [existing] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, id)))
      .limit(1);

    return NextResponse.json({ enrolled: !!existing });
  } catch (err) {
    console.error("[GET /api/courses/[id]/enroll]", err);
    return NextResponse.json({ enrolled: false });
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const userId = session!.user.id;

    // Check course exists and is published
    const [course] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(and(eq(courses.id, id), eq(courses.isPublished, true)))
      .limit(1);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check not already enrolled
    const [existing] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, id)))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    // Insert enrollment
    const [enrollment] = await db
      .insert(enrollments)
      .values({ userId, courseId: id })
      .returning();

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses/[id]/enroll]", error);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
