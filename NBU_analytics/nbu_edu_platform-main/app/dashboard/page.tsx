import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq, and, inArray, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  courses,
  videos,
  enrollments,
  progress,
  learningContent,
} from "@/lib/db/schema";
import { getSession } from "@/lib/auth-helpers";
import { getAuthHref } from "@/lib/auth/auth-routing";
import { CourseProgress } from "@/components/dashboard/CourseProgress";
import { ScoreHistory } from "@/components/dashboard/ScoreHistory";
import { DueCards } from "@/components/dashboard/DueCards";
import {
  getDashboardLabels,
  isSupportedLocale,
} from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — EduPulse",
  description: "Your learning dashboard with course progress, scores, and flashcard reviews.",
};

interface VideoProgressData {
  watched_sec?: number;
  last_position?: number;
  completed?: boolean;
}

interface ScoreProgressData {
  score_percent?: number;
  passed?: boolean;
}

interface FlashcardProgressData {
  card_id?: string;
  rating?: number;
}

interface FlashcardCard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

interface FlashcardContent {
  cards: FlashcardCard[];
}

function isCardDue(review: { rating: number; updatedAt: Date | null } | undefined): boolean {
  if (!review) return true;
  if (review.rating <= 2) return true;
  if (review.updatedAt) {
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return review.updatedAt.getTime() + twentyFourHours < Date.now();
  }
  return true;
}

async function getLocale(): Promise<SupportedLocale> {
  const jar = await cookies();
  const raw = jar.get("locale")?.value;
  return raw && isSupportedLocale(raw) ? raw : "ru";
}

export default async function DashboardPage() {
  const locale = await getLocale();
  const session = await getSession();
  if (!session) redirect(getAuthHref(locale, "login", "/dashboard"));

  const labels = getDashboardLabels(locale);
  const coursesHref = `/${locale}/courses`;
  const userId = session.user.id;

  // 1. Fetch enrollments with course data
  const userEnrollments = await db
    .select({
      courseId: enrollments.courseId,
      enrolledAt: enrollments.enrolledAt,
      title: courses.title,
      thumbnailUrl: courses.thumbnailUrl,
      category: courses.category,
      educatorName: courses.educatorName,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.enrolledAt));

  // 2. Build enrolled courses with progress
  const courseIds = userEnrollments.map((e) => e.courseId);

  const courseVideosMap: Record<string, Array<{ id: string; title: string }>> = {};
  const videoProgressMap: Record<string, VideoProgressData> = {};

  if (courseIds.length > 0) {
    const allVideos = await db
      .select({ id: videos.id, courseId: videos.courseId, title: videos.title })
      .from(videos)
      .where(inArray(videos.courseId, courseIds));

    for (const v of allVideos) {
      if (!courseVideosMap[v.courseId]) courseVideosMap[v.courseId] = [];
      courseVideosMap[v.courseId].push({ id: v.id, title: v.title });
    }

    const allVideoIds = allVideos.map((v) => v.id);
    if (allVideoIds.length > 0) {
      const videoProgressRows = await db
        .select({
          videoId: progress.videoId,
          data: progress.data,
          updatedAt: progress.updatedAt,
        })
        .from(progress)
        .where(
          and(
            eq(progress.userId, userId),
            eq(progress.progressType, "video"),
            inArray(progress.videoId, allVideoIds),
          ),
        );

      for (const row of videoProgressRows) {
        if (row.videoId) {
          videoProgressMap[row.videoId] = row.data as VideoProgressData;
        }
      }
    }
  }

  const enrolledCourses = userEnrollments.map((enrollment) => {
    const vids = courseVideosMap[enrollment.courseId] ?? [];
    const totalVideos = vids.length;
    const completedVideos = vids.filter(
      (v) => (videoProgressMap[v.id] as VideoProgressData | undefined)?.completed === true,
    ).length;
    const progressPercent = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

    let lastWatchedVideoId: string | null = null;
    let lastWatchedVideoTitle: string | null = null;

    for (const v of vids) {
      const prog = videoProgressMap[v.id];
      if (prog && !prog.completed) {
        lastWatchedVideoId = v.id;
        lastWatchedVideoTitle = v.title;
        break;
      }
    }

    if (!lastWatchedVideoId && vids.length > 0) {
      lastWatchedVideoId = vids[0].id;
      lastWatchedVideoTitle = vids[0].title;
    }

    return {
      courseId: enrollment.courseId,
      title: enrollment.title,
      thumbnailUrl: enrollment.thumbnailUrl,
      category: enrollment.category,
      educatorName: enrollment.educatorName,
      totalVideos,
      completedVideos,
      progressPercent,
      lastWatchedVideoId,
      lastWatchedVideoTitle,
    };
  });

  // 3. Fetch recent quiz/test scores
  const recentScoreRows = await db
    .select({
      contentId: progress.contentId,
      progressType: progress.progressType,
      data: progress.data,
      createdAt: progress.createdAt,
      videoId: progress.videoId,
    })
    .from(progress)
    .where(
      and(
        eq(progress.userId, userId),
        inArray(progress.progressType, ["quiz", "test"]),
      ),
    )
    .orderBy(desc(progress.createdAt))
    .limit(10);

  const scoreVideoIds = recentScoreRows
    .map((r) => r.videoId)
    .filter((id): id is string => id !== null);

  const videoTitleMap: Record<string, { title: string; courseId: string }> = {};
  const courseTitleMap: Record<string, string> = {};

  if (scoreVideoIds.length > 0) {
    const scoreVideos = await db
      .select({ id: videos.id, title: videos.title, courseId: videos.courseId })
      .from(videos)
      .where(inArray(videos.id, scoreVideoIds));

    for (const v of scoreVideos) {
      videoTitleMap[v.id] = { title: v.title, courseId: v.courseId };
    }

    const scoreCourseIds = [...new Set(scoreVideos.map((v) => v.courseId))];
    if (scoreCourseIds.length > 0) {
      const scoreCourses = await db
        .select({ id: courses.id, title: courses.title })
        .from(courses)
        .where(inArray(courses.id, scoreCourseIds));
      for (const c of scoreCourses) {
        courseTitleMap[c.id] = c.title;
      }
    }
  }

  const recentScores = recentScoreRows.map((row) => {
    const data = row.data as ScoreProgressData;
    const videoInfo = row.videoId ? videoTitleMap[row.videoId] : undefined;
    return {
      contentId: row.contentId ?? "",
      type: row.progressType as "quiz" | "test",
      scorePercent: data.score_percent ?? 0,
      passed: data.passed,
      videoTitle: videoInfo?.title ?? "—",
      courseTitle: videoInfo ? (courseTitleMap[videoInfo.courseId] ?? "—") : "—",
      completedAt: row.createdAt,
    };
  });

  // 4. Calculate stats
  const totalEnrolled = enrolledCourses.length;
  const coursesCompleted = enrolledCourses.filter((c) => c.progressPercent === 100).length;
  const quizzesTaken = recentScoreRows.length;
  const averageScore =
    recentScoreRows.length > 0
      ? Math.round(
          recentScoreRows.reduce(
            (sum, r) => sum + ((r.data as ScoreProgressData).score_percent ?? 0),
            0,
          ) / recentScoreRows.length,
        )
      : 0;

  // 5. Fetch due flashcards
  const dueCards: Array<{
    contentId: string;
    cardId: string;
    front: string;
    topic: string;
    videoTitle: string;
    courseTitle: string;
    courseId: string;
    videoId: string;
  }> = [];

  if (courseIds.length > 0) {
    const allVideoIds = Object.values(courseVideosMap)
      .flat()
      .map((v) => v.id);

    if (allVideoIds.length > 0) {
      const flashcardContents = await db
        .select({
          id: learningContent.id,
          videoId: learningContent.videoId,
          content: learningContent.content,
        })
        .from(learningContent)
        .where(
          and(
            inArray(learningContent.videoId, allVideoIds),
            eq(learningContent.contentType, "flashcards"),
          ),
        );

      const fcContentIds = flashcardContents.map((fc) => fc.id);
      const flashcardProgressMap: Record<string, { rating: number; updatedAt: Date | null }> = {};

      if (fcContentIds.length > 0) {
        const fcProgress = await db
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
              inArray(progress.contentId, fcContentIds),
            ),
          );

        for (const row of fcProgress) {
          const data = row.data as FlashcardProgressData;
          const key = `${row.contentId}:${data.card_id}`;
          const existing = flashcardProgressMap[key];
          if (!existing || (row.updatedAt && existing.updatedAt && row.updatedAt > existing.updatedAt)) {
            flashcardProgressMap[key] = {
              rating: data.rating ?? 0,
              updatedAt: row.updatedAt,
            };
          }
        }
      }

      const videoCourseMap: Record<string, string> = {};
      for (const [cId, vids] of Object.entries(courseVideosMap)) {
        for (const v of vids) {
          videoCourseMap[v.id] = cId;
        }
      }

      for (const fc of flashcardContents) {
        const content = fc.content as FlashcardContent;
        if (!content.cards) continue;

        const videoTitle =
          Object.values(courseVideosMap)
            .flat()
            .find((v) => v.id === fc.videoId)?.title ?? "—";
        const cId = videoCourseMap[fc.videoId] ?? "";
        const cTitle = userEnrollments.find((e) => e.courseId === cId)?.title ?? "—";

        for (const card of content.cards) {
          const key = `${fc.id}:${card.id}`;
          const review = flashcardProgressMap[key];

          if (isCardDue(review)) {
            dueCards.push({
              contentId: fc.id,
              cardId: card.id,
              front: card.front,
              topic: card.topic,
              videoTitle,
              courseTitle: cTitle,
              courseId: cId,
              videoId: fc.videoId,
            });
          }
        }
      }
    }
  }

  const stats = [
    { label: labels.enrolled, value: totalEnrolled },
    { label: labels.completed, value: coursesCompleted },
    { label: labels.quizzesTaken, value: quizzesTaken },
    { label: labels.avgScore, value: averageScore, suffix: "%" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            {labels.welcome} {session.user.name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {labels.subtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="font-mono text-3xl font-bold text-primary">
                {stat.value > 0 ? stat.value : "—"}
                {stat.value > 0 && stat.suffix ? stat.suffix : ""}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {labels.myCourses}
            </h2>
            <Link
              href={coursesHref}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {labels.browseMore}
            </Link>
          </div>
          <CourseProgress courses={enrolledCourses} labels={labels} coursesHref={coursesHref} />
        </section>

        {/* Two-column: Scores + Due Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
              {labels.recentScores}
            </h2>
            <ScoreHistory scores={recentScores} labels={labels} />
          </section>

          <section>
            <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
              {labels.flashcardReviews}
            </h2>
            <DueCards cards={dueCards} labels={labels} />
          </section>
        </div>
      </div>
    </main>
  );
}
