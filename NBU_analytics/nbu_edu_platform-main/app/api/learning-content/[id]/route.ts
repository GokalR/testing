import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningContent } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-helpers";

const VALID_TYPES = ["quiz", "flashcards", "mental_map", "test"] as const;
type ContentType = (typeof VALID_TYPES)[number];

function isValidContentType(type: string): type is ContentType {
  return (VALID_TYPES as readonly string[]).includes(type);
}

interface UpdateContentBody {
  content_type?: string;
  content?: unknown;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = (await req.json()) as UpdateContentBody;

    if (
      body.content_type !== undefined &&
      !isValidContentType(body.content_type)
    ) {
      return NextResponse.json(
        { error: `Invalid content_type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(learningContent)
      .set({
        ...(body.content_type !== undefined && { contentType: body.content_type }),
        ...(body.content !== undefined && { content: body.content }),
        updatedAt: new Date(),
      })
      .where(eq(learningContent.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Learning content not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/learning-content/[id]]", error);
    return NextResponse.json({ error: "Failed to update learning content" }, { status: 500 });
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

    await db.delete(learningContent).where(eq(learningContent.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/learning-content/[id]]", error);
    return NextResponse.json({ error: "Failed to delete learning content" }, { status: 500 });
  }
}
