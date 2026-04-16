import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningContent, progress } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";
import { gradeQuiz } from "@/lib/scoring";
import type { QuizQuestion } from "@/lib/scoring";

interface QuizProgressBody {
  content_id: string;
  answers: Record<string, string>;
}

interface QuizContentJson {
  questions: QuizQuestion[];
}

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = (await req.json()) as QuizProgressBody;
    const { content_id, answers } = body;

    if (!content_id || !answers) {
      return NextResponse.json(
        { error: "Missing required fields: content_id, answers" },
        { status: 400 }
      );
    }

    // Fetch learning content
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

    if (content.contentType !== "quiz") {
      return NextResponse.json(
        { error: "Content type is not quiz" },
        { status: 400 }
      );
    }

    const quizContent = content.content as QuizContentJson;
    const { scorePercent, corrections } = gradeQuiz(
      quizContent.questions,
      answers
    );

    const userId = session!.user.id;

    await db.insert(progress).values({
      userId,
      videoId: content.videoId,
      contentId: content_id,
      progressType: "quiz",
      data: {
        answers,
        score_percent: scorePercent,
        passed: scorePercent >= 70,
        corrections,
      },
    });

    return NextResponse.json({ score_percent: scorePercent, corrections });
  } catch (error) {
    console.error("[POST /api/progress/quiz]", error);
    return NextResponse.json(
      { error: "Failed to save quiz progress" },
      { status: 500 }
    );
  }
}
