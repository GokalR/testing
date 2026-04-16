import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, videos, enrollments } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-helpers";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { getAuthHref } from "@/lib/auth/auth-routing";
import {
  resolveCourseParam,
  DB_VIDEO_ID_TO_EPISODE_SLUG,
} from "@/lib/course-content/constants";
import {
  getCourseBySlug,
  getUiCopy,
  isSupportedLocale,
} from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";
import type { Metadata } from "next";

interface CourseDetailProps {
  params: Promise<{ id: string }>;
}

interface VideoRow {
  id: string;
  title: string;
  description: string | null;
  durationSec: number | null;
  sortOrder: number | null;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTotalDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

async function getLocale(): Promise<SupportedLocale> {
  const jar = await cookies();
  const raw = jar.get("locale")?.value;
  return raw && isSupportedLocale(raw) ? raw : "ru";
}

export async function generateMetadata({ params }: CourseDetailProps): Promise<Metadata> {
  const { id: rawParam } = await params;
  const resolved = resolveCourseParam(rawParam);
  if (!resolved) return { title: "Course Not Found — EduPulse" };

  const [course] = await db
    .select({ title: courses.title, description: courses.description })
    .from(courses)
    .where(eq(courses.id, resolved.dbId))
    .limit(1);

  if (!course) {
    return { title: "Course Not Found — EduPulse" };
  }

  return {
    title: `${course.title} — EduPulse`,
    description: course.description ?? undefined,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const { id: rawParam } = await params;
  const resolved = resolveCourseParam(rawParam);
  if (!resolved) notFound();

  const courseId = resolved.dbId;
  const courseSlug = resolved.slug;

  // Fetch course
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course || !course.isPublished) {
    notFound();
  }

  // Locale + static content
  const locale = await getLocale();
  const copy = getUiCopy(locale);
  const staticCourse = getCourseBySlug(locale, courseSlug);

  // Fetch videos ordered by sort_order
  const courseVideos: VideoRow[] = await db
    .select({
      id: videos.id,
      title: videos.title,
      description: videos.description,
      durationSec: videos.durationSec,
      sortOrder: videos.sortOrder,
    })
    .from(videos)
    .where(eq(videos.courseId, courseId))
    .orderBy(asc(videos.sortOrder));

  // Check enrollment if session exists
  const session = await getSession();
  let isEnrolled = false;

  if (session?.user?.id) {
    const [enrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        eq(enrollments.userId, session.user.id) &&
          eq(enrollments.courseId, courseId),
      )
      .limit(1);
    isEnrolled = !!enrollment;
  }

  const totalDurationSec = courseVideos.reduce(
    (sum, v) => sum + (v.durationSec ?? 0),
    0,
  );
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Back link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {copy.backLabel}
        </Link>

        {/* Course Header */}
        <header className="mb-10">
          {course.category && (
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              {course.category}
            </span>
          )}
          <h1 className="font-heading text-4xl font-bold text-foreground leading-tight mb-4">
            {staticCourse?.title ?? course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-5">
            {course.educatorName && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                {course.educatorName}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                />
              </svg>
              {courseVideos.length} {courseVideos.length === 1 ? "lesson" : "lessons"}
            </span>
            {totalDurationSec > 0 && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTotalDuration(totalDurationSec)} total
              </span>
            )}
          </div>
          {(staticCourse?.description ?? course.description) && (
            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
              {staticCourse?.description ?? course.description}
            </p>
          )}
        </header>

        {/* Two-column layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* Left: Lessons List */}
          <section className="lg:col-span-2 mb-10 lg:mb-0">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-5">
              Course Lessons
            </h2>

            {courseVideos.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No lessons available yet.
              </p>
            ) : (
              <ol className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {courseVideos.map((video, idx) => {
                  const lessonNumber = String(idx + 1).padStart(2, "0");
                  const videoSlug = DB_VIDEO_ID_TO_EPISODE_SLUG[video.id] ?? video.id;
                  const href = `/courses/${courseSlug}/learn/${videoSlug}`;

                  return (
                    <li key={video.id}>
                      {isEnrolled ? (
                        <Link
                          href={href}
                          className="group flex items-center gap-4 px-5 py-4 bg-card transition-colors hover:bg-secondary"
                        >
                          <LessonRow
                            number={lessonNumber}
                            title={video.title}
                            durationSec={video.durationSec}
                            isEnrolled={true}
                          />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-4 px-5 py-4 bg-card">
                          <LessonRow
                            number={lessonNumber}
                            title={video.title}
                            durationSec={video.durationSec}
                            isEnrolled={false}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {/* Right: Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Thumbnail */}
              <div className="relative aspect-video w-full bg-secondary">
                {course.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg
                      className="h-16 w-16 text-muted-foreground/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Sidebar content */}
              <div className="p-5 flex flex-col gap-5">
                <EnrollButton
                  courseId={courseId}
                  labels={{
                    enroll: "Enroll Now",
                    enrolled: "Enrolled",
                    signIn: "Sign In to Enroll",
                  }}
                  signInHref={getAuthHref(locale, "login", `/courses/${rawParam}`)}
                />

                {/* What you'll get */}
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground mb-3">
                    What&apos;s included
                  </h3>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {courseVideos.length} video {courseVideos.length === 1 ? "lesson" : "lessons"}
                    </li>
                    {totalDurationSec > 0 && (
                      <li className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {formatTotalDuration(totalDurationSec)} of content
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Quizzes &amp; flashcards
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Mental maps &amp; tests
                    </li>
                  </ul>
                </div>

                {/* Educator */}
                {course.educatorName && (
                  <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Educator: </span>
                    {course.educatorName}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Sub-component: lesson row content (shared between linked and unlinked states)
interface LessonRowProps {
  number: string;
  title: string;
  durationSec: number | null;
  isEnrolled: boolean;
}

function LessonRow({ number, title, durationSec, isEnrolled }: LessonRowProps) {
  return (
    <>
      {/* Lesson number */}
      <span
        className="font-mono text-xs font-semibold tabular-nums text-muted-foreground shrink-0 w-6"
        aria-hidden="true"
      >
        {number}
      </span>

      {/* Lock icon for unenrolled */}
      {!isEnrolled && (
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      )}

      {/* Play icon for enrolled */}
      {isEnrolled && (
        <svg
          className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
      )}

      {/* Title */}
      <span
        className={`flex-1 text-sm font-medium leading-snug ${
          isEnrolled
            ? "text-foreground group-hover:text-primary transition-colors"
            : "text-muted-foreground"
        }`}
      >
        {title}
      </span>

      {/* Duration badge */}
      {durationSec !== null && durationSec > 0 && (
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
          {formatDuration(durationSec)}
        </span>
      )}
    </>
  );
}
