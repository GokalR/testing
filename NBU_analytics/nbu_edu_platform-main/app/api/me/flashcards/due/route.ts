import { NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  courses,
  videos,
  enrollments,
  progress,
  learningContent,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";

interface FlashCard {
  id: string;
  front: string;
  back: string;
  topic?: string;
}

interface FlashcardsContentJson {
  cards: FlashCard[];
}

interface FlashcardProgressData {
  card_id?: string;
  rating?: number;
}

interface DueCard {
  contentId: string;
  cardId: string;
  front: string;
  back: string;
  topic: string;
  videoTitle: string;
  courseTitle: string;
  lastRating: number | null;
  lastReviewedAt: string | null;
}

interface DueFlashcardsResponse {
  dueCards: DueCard[];
  totalDue: number;
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const userId = session!.user.id;

    // 1. Get user's enrolled courses
    const userEnrollments = await db
      .select({
        courseId: enrollments.courseId,
        courseTitle: courses.title,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId));

    if (userEnrollments.length === 0) {
      return NextResponse.json<DueFlashcardsResponse>({
        dueCards: [],
        totalDue: 0,
      });
    }

    const courseIds = userEnrollments.map((e) => e.courseId);
    const courseTitleMap = new Map<string, string>(
      userEnrollments.map((e) => [e.courseId, e.courseTitle]),
    );

    // 2. Get all videos for enrolled courses
    const allVideos = await db
      .select({
        id: videos.id,
        courseId: videos.courseId,
        title: videos.title,
      })
      .from(videos)
      .where(inArray(videos.courseId, courseIds));

    if (allVideos.length === 0) {
      return NextResponse.json<DueFlashcardsResponse>({
        dueCards: [],
        totalDue: 0,
      });
    }

    const videoIds = allVideos.map((v) => v.id);
    const videoTitleMap = new Map<string, string>(
      allVideos.map((v) => [v.id, v.title]),
    );
    const videoCourseMap = new Map<string, string>(
      allVideos.map((v) => [v.id, v.courseId]),
    );

    // 3. Get all flashcard learning_content for those videos
    const flashcardContents = await db
      .select({
        id: learningContent.id,
        videoId: learningContent.videoId,
        content: learningContent.content,
      })
      .from(learningContent)
      .where(
        and(
          inArray(learningContent.videoId, videoIds),
          eq(learningContent.contentType, "flashcards"),
        ),
      );

    if (flashcardContents.length === 0) {
      return NextResponse.json<DueFlashcardsResponse>({
        dueCards: [],
        totalDue: 0,
      });
    }

    const contentIds = flashcardContents.map((fc) => fc.id);

    // 4. Get user's flashcard progress records for these content items
    const flashcardProgressRecords = await db
      .select({
        contentId: progress.contentId,
        data: progress.data,
        updatedAt: progress.updatedAt,
      })
      .from(progress)
      .where(
        and(
          eq(progress.userId, userId),
          eq(progress.progressType, "flashcard"),
          inArray(progress.contentId, contentIds),
        ),
      );

    // Build a map: "contentId:cardId" → latest progress record
    const latestReviewMap = new Map<
      string,
      { rating: number; reviewedAt: Date | null }
    >();

    for (const rec of flashcardProgressRecords) {
      if (!rec.contentId) continue;
      const d = rec.data as FlashcardProgressData;
      if (!d.card_id) continue;

      const key = `${rec.contentId}:${d.card_id}`;
      const existing = latestReviewMap.get(key);

      if (
        !existing ||
        (rec.updatedAt &&
          existing.reviewedAt &&
          rec.updatedAt > existing.reviewedAt) ||
        (rec.updatedAt && !existing.reviewedAt)
      ) {
        latestReviewMap.set(key, {
          rating: d.rating ?? 0,
          reviewedAt: rec.updatedAt,
        });
      }
    }

    // 5. Determine due cards
    const now = new Date();
    const dueCards: DueCard[] = [];

    for (const fc of flashcardContents) {
      const content = fc.content as FlashcardsContentJson;
      if (!Array.isArray(content.cards)) continue;

      const videoTitle = videoTitleMap.get(fc.videoId) ?? "";
      const courseId = videoCourseMap.get(fc.videoId) ?? "";
      const courseTitle = courseTitleMap.get(courseId) ?? "";

      for (const card of content.cards) {
        const key = `${fc.id}:${card.id}`;
        const review = latestReviewMap.get(key);

        let isDue = false;
        let lastRating: number | null = null;
        let lastReviewedAt: string | null = null;

        if (!review) {
          // Never reviewed → due
          isDue = true;
        } else {
          lastRating = review.rating;
          lastReviewedAt = review.reviewedAt
            ? review.reviewedAt.toISOString()
            : null;

          if (review.rating <= 2) {
            // Rating 1 (Again) or 2 (Hard) → due
            isDue = true;
          } else if (
            review.reviewedAt &&
            now.getTime() - review.reviewedAt.getTime() > TWENTY_FOUR_HOURS_MS
          ) {
            // Reviewed more than 24 hours ago → due
            isDue = true;
          }
        }

        if (isDue) {
          dueCards.push({
            contentId: fc.id,
            cardId: card.id,
            front: card.front,
            back: card.back,
            topic: card.topic ?? "",
            videoTitle,
            courseTitle,
            lastRating,
            lastReviewedAt,
          });
        }
      }
    }

    return NextResponse.json<DueFlashcardsResponse>({
      dueCards,
      totalDue: dueCards.length,
    });
  } catch (error) {
    console.error("[GET /api/me/flashcards/due]", error);
    return NextResponse.json(
      { error: "Failed to fetch due flashcards" },
      { status: 500 },
    );
  }
}
