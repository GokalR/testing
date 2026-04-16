import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningContent } from "@/lib/db/schema";

const VALID_TYPES = ["quiz", "flashcards", "mental_map", "test"] as const;
type ContentType = (typeof VALID_TYPES)[number];

function isValidType(type: string): type is ContentType {
  return (VALID_TYPES as readonly string[]).includes(type);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const { id, type } = await params;

    if (!isValidType(type)) {
      return NextResponse.json(
        { error: `Invalid content type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const [content] = await db
      .select()
      .from(learningContent)
      .where(
        and(
          eq(learningContent.videoId, id),
          eq(learningContent.contentType, type)
        )
      )
      .limit(1);

    if (!content) {
      return NextResponse.json(
        { error: "Learning content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("[GET /api/videos/[id]/content/[type]]", error);
    return NextResponse.json(
      { error: "Failed to fetch learning content" },
      { status: 500 }
    );
  }
}
