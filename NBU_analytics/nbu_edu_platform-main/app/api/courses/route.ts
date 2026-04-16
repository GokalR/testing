import { NextRequest, NextResponse } from "next/server";
import { and, eq, ilike, or, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, videos } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(courses.isPublished, true)];

    if (search) {
      conditions.push(
        or(
          ilike(courses.title, `%${search}%`),
          ilike(courses.description, `%${search}%`)
        )!
      );
    }

    if (category) {
      conditions.push(eq(courses.category, category));
    }

    const where = and(...conditions);

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(courses)
      .where(where);

    // Get courses with video count subquery
    const rows = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        thumbnailUrl: courses.thumbnailUrl,
        category: courses.category,
        educatorName: courses.educatorName,
        isPublished: courses.isPublished,
        sortOrder: courses.sortOrder,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        videoCount: sql<number>`(
          SELECT COUNT(*)::int FROM ${videos} WHERE ${videos.courseId} = ${courses.id}
        )`,
      })
      .from(courses)
      .where(where)
      .orderBy(courses.sortOrder, courses.createdAt)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      courses: rows,
      total: Number(total),
      page,
      limit,
    });
  } catch (error) {
    console.error("[GET /api/courses]", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

interface CreateCourseBody {
  title: string;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  educator_name?: string;
  is_published?: boolean;
  sort_order?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = (await req.json()) as CreateCourseBody;

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const [created] = await db
      .insert(courses)
      .values({
        title: body.title.trim(),
        description: body.description,
        thumbnailUrl: body.thumbnail_url,
        category: body.category,
        educatorName: body.educator_name,
        isPublished: body.is_published ?? false,
        sortOrder: body.sort_order ?? 0,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses]", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
