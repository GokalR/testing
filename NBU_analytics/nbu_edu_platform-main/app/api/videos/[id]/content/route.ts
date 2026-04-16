import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { learningContent } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-helpers";

const VALID_TYPES = ["quiz", "flashcards", "mental_map", "test"] as const;
type ContentType = (typeof VALID_TYPES)[number];

function isValidContentType(type: string): type is ContentType {
  return (VALID_TYPES as readonly string[]).includes(type);
}

interface CreateContentBody {
  content_type: string;
  content: unknown;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id: videoId } = await params;
    const body = (await req.json()) as CreateContentBody;

    if (!body.content_type || typeof body.content_type !== "string") {
      return NextResponse.json(
        { error: `content_type is required and must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!isValidContentType(body.content_type)) {
      return NextResponse.json(
        { error: `Invalid content_type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (body.content === undefined || body.content === null) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const [created] = await db
      .insert(learningContent)
      .values({
        videoId,
        contentType: body.content_type,
        content: body.content,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[POST /api/videos/[id]/content]", error);
    return NextResponse.json({ error: "Failed to create learning content" }, { status: 500 });
  }
}
