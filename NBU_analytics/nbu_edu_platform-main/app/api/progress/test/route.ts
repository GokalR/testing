import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learningContent, progress } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";
import { gradeTest } from "@/lib/scoring";
import type { TestQuestion } from "@/lib/scoring";

interface TestProgressBody {
  content_id: string;
  answers: Record<string, string>;
  time_spent_sec: number;
}

interface TestContentJson {
  test_title: string;
  time_limit_minutes: number;
  passing_score_percent: number;
  questions: TestQuestion[];
}

export async function POST(req: NextRequest) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = (await req.json()) as TestProgressBody;
    const { content_id, answers, time_spent_sec } = body;

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

    if (content.contentType !== "test") {
      return NextResponse.json(
        { error: "Content type is not test" },
        { status: 400 }
      );
    }

    const testContent = content.content as TestContentJson;
    const passingScore = testContent.passing_score_percent ?? 70;
    const { scorePercent, totalPoints, earnedPoints, passed, corrections } =
      gradeTest(testContent.questions, answers, passingScore);

    const userId = session!.user.id;

    await db.insert(progress).values({
      userId,
      videoId: content.videoId,
      contentId: content_id,
      progressType: "test",
      data: {
        answers,
        score_percent: scorePercent,
        passed,
        time_spent_sec: time_spent_sec ?? 0,
        corrections,
      },
    });

    return NextResponse.json({
      score_percent: scorePercent,
      passed,
      total_points: totalPoints,
      earned_points: earnedPoints,
      corrections,
    });
  } catch (error) {
    console.error("[POST /api/progress/test]", error);
    return NextResponse.json(
      { error: "Failed to save test progress" },
      { status: 500 }
    );
  }
}
