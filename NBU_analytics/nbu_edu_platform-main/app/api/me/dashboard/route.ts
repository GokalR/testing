import { NextResponse } from "next/server";
import { eq, and, inArray, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  courses,
  videos,
  enrollments,
  progress,
} from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-helpers";

interface EnrolledCourse {
  courseId: string;
  title: string;
  thumbnailUrl: string | null;
  category: string | null;
  educatorName: string | null;
  enrolledAt: Date | null;
  totalVideos: number;
  completedVideos: number;
  progressPercent: number;
  lastWatchedVideoId: string | null;
  lastWatchedVideoTitle: string | null;
}

interface RecentScore {
  contentId: string;
  type: "quiz" | "test";
  scorePercent: number;
  passed?: boolean;
  videoTitle: string;
  courseTitle: string;
  completedAt: Date | null;
}

interface DashboardStats {
  totalEnrolled: number;
  coursesCompleted: number;
  quizzesTaken: number;
  averageScore: number;
}

interface DashboardResponse {
  enrolledCourses: EnrolledCourse[];
  recentScores: RecentScore[];
  stats: DashboardStats;
}

interface VideoProgressData {
  watched_sec?: number;
  last_position?: number;
  completed?: boolean;
}

interface QuizTestProgressData {
  answers?: Record<string, string>;
  score_percent?: number;
  passed?: boolean;
  time_spent_sec?: number;
}

export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const userId = session!.user.id;

    // 1. Get user's enrollments with course data
    const userEnrollments = await db
      .select({
        courseId: enrollments.courseId,
        enrolledAt: enrollments.enrolledAt,
        courseTitle: courses.title,
        thumbnailUrl: courses.thumbnailUrl,
        category: courses.category,
        educatorName: courses.educatorName,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId));

    if (userEnrollments.length === 0) {
      return NextResponse.json<DashboardResponse>({
        enrolledCourses: [],
        recentScores: [],
        stats: {
          totalEnrolled: 0,
          coursesCompleted: 0,
          quizzesTaken: 0,
          averageScore: 0,
        },
      });
    }

    const courseIds = userEnrollments.map((e) => e.courseId);

    // 2. Get all videos for enrolled courses
    const allVideos = await db
      .select({
        id: videos.id,
        courseId: videos.courseId,
        title: videos.title,
      })
      .from(videos)
      .where(inArray(videos.courseId, courseIds));

    const videoIds = allVideos.map((v) => v.id);

    // 3. Get all video progress for the user
    const videoProgressRecords =
      videoIds.length > 0
        ? await db
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
                inArray(progress.videoId, videoIds),
              ),
            )
        : [];

    // Build a map: videoId → latest progress record
    const latestVideoProgress = new Map<
      string,
      { data: unknown; updatedAt: Date | null }
    >();
    for (const rec of videoProgressRecords) {
      if (!rec.videoId) continue;
      const existing = latestVideoProgress.get(rec.videoId);
      if (
        !existing ||
        (rec.updatedAt &&
          existing.updatedAt &&
          rec.updatedAt > existing.updatedAt) ||
        (rec.updatedAt && !existing.updatedAt)
      ) {
        latestVideoProgress.set(rec.videoId, {
          data: rec.data,
          updatedAt: rec.updatedAt,
        });
      }
    }

    // 4. Build enrolled courses with progress
    const enrolledCourses: EnrolledCourse[] = userEnrollments.map((enr) => {
      const courseVideos = allVideos.filter((v) => v.courseId === enr.courseId);
      const totalVideos = courseVideos.length;

      const completedVideos = courseVideos.filter((v) => {
        const rec = latestVideoProgress.get(v.id);
        if (!rec) return false;
        const d = rec.data as VideoProgressData;
        return d.completed === true;
      }).length;

      const progressPercent =
        totalVideos > 0
          ? Math.round((completedVideos / totalVideos) * 100)
          : 0;

      // Find the most recently watched video
      let lastWatchedVideoId: string | null = null;
      let lastWatchedVideoTitle: string | null = null;
      let latestUpdatedAt: Date | null = null;

      for (const v of courseVideos) {
        const rec = latestVideoProgress.get(v.id);
        if (!rec || !rec.updatedAt) continue;
        if (!latestUpdatedAt || rec.updatedAt > latestUpdatedAt) {
          latestUpdatedAt = rec.updatedAt;
          lastWatchedVideoId = v.id;
          lastWatchedVideoTitle = v.title;
        }
      }

      return {
        courseId: enr.courseId,
        title: enr.courseTitle,
        thumbnailUrl: enr.thumbnailUrl,
        category: enr.category,
        educatorName: enr.educatorName,
        enrolledAt: enr.enrolledAt,
        totalVideos,
        completedVideos,
        progressPercent,
        lastWatchedVideoId,
        lastWatchedVideoTitle,
      };
    });

    // 5. Get recent quiz/test scores (last 10)
    const recentProgressRecords =
      videoIds.length > 0
        ? await db
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
                inArray(progress.videoId, videoIds),
              ),
            )
            .orderBy(desc(progress.createdAt))
            .limit(10)
        : [];

    // Build video → course map
    const videoCourseMap = new Map<string, string>();
    const videoTitleMap = new Map<string, string>();
    for (const v of allVideos) {
      videoCourseMap.set(v.id, v.courseId);
      videoTitleMap.set(v.id, v.title);
    }

    const courseTitleMap = new Map<string, string>();
    for (const enr of userEnrollments) {
      courseTitleMap.set(enr.courseId, enr.courseTitle);
    }

    const recentScores: RecentScore[] = recentProgressRecords
      .filter((rec) => rec.contentId !== null && rec.videoId !== null)
      .map((rec) => {
        const d = rec.data as QuizTestProgressData;
        const videoTitle = rec.videoId
          ? (videoTitleMap.get(rec.videoId) ?? "")
          : "";
        const courseId = rec.videoId
          ? (videoCourseMap.get(rec.videoId) ?? "")
          : "";
        const courseTitle = courseTitleMap.get(courseId) ?? "";

        return {
          contentId: rec.contentId!,
          type: rec.progressType as "quiz" | "test",
          scorePercent: d.score_percent ?? 0,
          passed: d.passed,
          videoTitle,
          courseTitle,
          completedAt: rec.createdAt,
        };
      });

    // 6. Calculate stats
    const totalEnrolled = userEnrollments.length;
    const coursesCompleted = enrolledCourses.filter(
      (c) => c.progressPercent === 100 && c.totalVideos > 0,
    ).length;

    // Count all quiz/test submissions
    const quizCountResult =
      videoIds.length > 0
        ? await db
            .select({ count: sql<number>`count(*)::int` })
            .from(progress)
            .where(
              and(
                eq(progress.userId, userId),
                inArray(progress.progressType, ["quiz", "test"]),
                inArray(progress.videoId, videoIds),
              ),
            )
        : [{ count: 0 }];

    const quizzesTaken = quizCountResult[0]?.count ?? 0;

    // Average score across all quiz/test submissions
    const avgScoreResult =
      videoIds.length > 0
        ? await db
            .select({
              avg: sql<number>`avg((${progress.data}->>'score_percent')::numeric)`,
            })
            .from(progress)
            .where(
              and(
                eq(progress.userId, userId),
                inArray(progress.progressType, ["quiz", "test"]),
                inArray(progress.videoId, videoIds),
              ),
            )
        : [{ avg: 0 }];

    const averageScore = Math.round(avgScoreResult[0]?.avg ?? 0);

    const response: DashboardResponse = {
      enrolledCourses,
      recentScores,
      stats: {
        totalEnrolled,
        coursesCompleted,
        quizzesTaken,
        averageScore,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/me/dashboard]", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
