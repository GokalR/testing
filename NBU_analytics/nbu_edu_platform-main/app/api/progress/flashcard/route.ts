import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningContent, progress } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";

interface FlashcardProgressBody {
  content_id: string;
  card_id: string;
  rating: number; // 1=Again, 2=Hard, 3=Good, 4=Easy
}

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = (await req.json()) as FlashcardProgressBody;
    const { content_id, card_id, rating } = body;

    if (!content_id || !card_id || rating === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: content_id, card_id, rating" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 4) {
      return NextResponse.json(
        { error: "rating must be an integer between 1 and 4" },
        { status: 400 }
      );
    }

    // Validate content exists and is flashcards type
    const [content] = await db
      .select()
      .from(learningContent)
      .where(eq(learningContent.id, content_id))
      .limit(1);

    if (!content) {
      return NextResponse.json(
        { error: "Learning content not found" },
        { status: 404 }
      );
    }

    if (content.contentType !== "flashcards") {
      return NextResponse.json(
        { error: "Content type is not flashcards" },
        { status: 400 }
      );
    }

    const userId = session!.user.id;

    const [inserted] = await db
      .insert(progress)
      .values({
        userId,
        videoId: content.videoId,
        contentId: content_id,
        progressType: "flashcard",
        data: { card_id, rating },
      })
      .returning();

    return NextResponse.json(inserted);
  } catch (error) {
    console.error("[POST /api/progress/flashcard]", error);
    return NextResponse.json(
      { error: "Failed to save flashcard progress" },
      { status: 500 }
    );
  }
}
