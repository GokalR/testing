import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { courses, videos, enrollments, progress } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-helpers";
import { getAuthHref } from "@/lib/auth/auth-routing";
import { LearningPageClient } from "@/components/learning/LearningPageClient";
import { EpisodeContentSidebar } from "@/components/learning/EpisodeContentSidebar";
import { SectionPanel } from "@/components/courses/SectionPanel";
import { CourseNotice } from "@/components/courses/CourseNotice";
import {
  getEpisodeBySlug,
  getCourseBySlug,
  getUiCopy,
  getQuizLabels,
  getFlashcardLabels,
  getMindMapLabels,
  isSupportedLocale,
} from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";
import {
  resolveCourseParam,
  resolveVideoParam,
  DB_VIDEO_ID_TO_EPISODE_SLUG,
} from "@/lib/course-content/constants";

interface LearningPageProps {
  params: Promise<{ id: string; videoId: string }>;
}

async function getLocale(): Promise<SupportedLocale> {
  const jar = await cookies();
  const raw = jar.get("locale")?.value;
  return raw && isSupportedLocale(raw) ? raw : "ru";
}

export async function generateMetadata({
  params,
}: LearningPageProps): Promise<Metadata> {
  const { videoId: rawVideoParam } = await params;
  const resolved = resolveVideoParam(rawVideoParam);
  if (!resolved) return { title: "Lesson Not Found — EduPulse" };

  const [video] = await db
    .select({ title: videos.title })
    .from(videos)
    .where(eq(videos.id, resolved.dbId))
    .limit(1);

  if (!video) {
    return { title: "Lesson Not Found — EduPulse" };
  }

  return {
    title: `${video.title} — EduPulse`,
  };
}

export default async function LearningPage({ params }: LearningPageProps) {
  const { id: rawCourseParam, videoId: rawVideoParam } = await params;

  // Resolve slug or UUID params to DB IDs
  const courseResolved = resolveCourseParam(rawCourseParam);
  const videoResolved = resolveVideoParam(rawVideoParam);
  if (!courseResolved || !videoResolved) notFound();

  const courseId = courseResolved.dbId;
  const videoId = videoResolved.dbId;
  const courseSlug = courseResolved.slug;
  const episodeSlug = videoResolved.slug;

  // 1. Auth check
  const session = await getSession();
  if (!session) {
    const locale = await getLocale();
    redirect(getAuthHref(locale, "login", `/courses/${rawCourseParam}/learn/${rawVideoParam}`));
  }

  // 2. Fetch course — must exist and be published
  const [course] = await db
    .select({
      id: courses.id,
      title: courses.title,
      isPublished: courses.isPublished,
    })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course || !course.isPublished) {
    notFound();
  }

  // 3. Check enrollment
  const [enrollment] = await db
    .select({ id: enrollments.id })
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, session.user.id),
        eq(enrollments.courseId, courseId),
      ),
    )
    .limit(1);

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  // 4. Fetch the current video — must belong to this course
  const [currentVideo] = await db
    .select({
      id: videos.id,
      title: videos.title,
      description: videos.description,
      videoUrl: videos.videoUrl,
      durationSec: videos.durationSec,
      courseId: videos.courseId,
    })
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1);

  if (!currentVideo || currentVideo.courseId !== courseId) {
    notFound();
  }

  // 5. Fetch all videos for lesson list (ordered by sortOrder)
  const allVideos = await db
    .select({
      id: videos.id,
      title: videos.title,
      durationSec: videos.durationSec,
      sortOrder: videos.sortOrder,
    })
    .from(videos)
    .where(eq(videos.courseId, courseId))
    .orderBy(asc(videos.sortOrder));

  // 6. Fetch video progress for this user
  const videoProgress = await db
    .select({ videoId: progress.videoId, data: progress.data })
    .from(progress)
    .where(
      and(
        eq(progress.userId, session.user.id),
        eq(progress.progressType, "video"),
      ),
    );

  const completedVideoIds = videoProgress
    .filter(
      (p) => p.videoId && (p.data as { completed?: boolean })?.completed,
    )
    .map((p) => p.videoId!);

  const currentVideoProgress = videoProgress.find(
    (p) => p.videoId === videoId,
  );
  const initialPosition =
    (currentVideoProgress?.data as { last_position?: number })
      ?.last_position ?? 0;

  // 7. Locale + static content
  const locale = await getLocale();
  const copy = getUiCopy(locale);

  const episode = getEpisodeBySlug(locale, courseSlug, episodeSlug);
  const staticCourse = getCourseBySlug(locale, courseSlug);

  const quizLabels = getQuizLabels(locale);
  const flashcardLabels = getFlashcardLabels(locale);
  const mindMapLabels = getMindMapLabels(locale);

  return (
    <main className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3">
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground shrink-0"
            aria-label={`${copy.backLabel} — ${course.title}`}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline truncate max-w-[200px]">
              {staticCourse?.title ?? course.title}
            </span>
            <span className="sm:hidden">{copy.backLabel}</span>
          </Link>

          <span className="text-border" aria-hidden="true">
            /
          </span>

          <h2 className="truncate text-sm font-medium text-foreground">
            {episode?.title ?? currentVideo.title}
          </h2>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-screen-2xl px-4 py-6">
        <LearningPageClient
          video={{
            id: currentVideo.id,
            title: episode?.title ?? currentVideo.title,
            description:
              episode?.description ?? currentVideo.description,
            videoUrl: episode?.videoUrl ?? currentVideo.videoUrl,
            durationSec: currentVideo.durationSec,
          }}
          lessons={allVideos}
          courseId={courseSlug}
          completedVideoIds={completedVideoIds}
          initialPosition={initialPosition}
          lessonsLabel={copy.lessonsListLabel}
          videoSlugMap={DB_VIDEO_ID_TO_EPISODE_SLUG}
          sidebarSlot={
            episode ? (
              <EpisodeContentSidebar
                quiz={episode.quiz}
                flashcards={episode.flashcards}
                mentalMap={episode.mentalMap}
                test={episode.test}
                tabLabels={{
                  quiz: copy.quizLabel,
                  flashcards: copy.flashcardsLabel,
                  mentalMap: copy.mentalMapLabel,
                  test: copy.testLabel,
                }}
                quizLabels={quizLabels}
                flashcardLabels={flashcardLabels}
                mindMapLabels={mindMapLabels}
                className="h-full"
              />
            ) : undefined
          }
        >
          {/* Transcript below the video */}
          {episode && (
            <>
              {episode.localeNotice && (
                <CourseNotice>
                  <p>{episode.localeNotice}</p>
                  <p className="mt-2">{copy.availableInRussian}</p>
                </CourseNotice>
              )}

              <SectionPanel title={copy.transcriptLabel}>
                <div className="whitespace-pre-line text-sm leading-8">
                  {episode.transcript}
                </div>
              </SectionPanel>
            </>
          )}
        </LearningPageClient>
      </div>
    </main>
  );
}
