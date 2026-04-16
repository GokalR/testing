import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, videos, learningContent } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-helpers";
import { getAuthHref, getLocaleFromCookieValue } from "@/lib/auth/auth-routing";
import { CourseForm } from "@/components/admin/CourseForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [course] = await db
    .select({ title: courses.title })
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);

  return {
    title: course ? `Edit: ${course.title} — Admin` : "Edit Course — Admin",
  };
}

export default async function AdminCourseEditPage({ params }: PageProps) {
  const { id } = await params;
  const jar = await cookies();
  const locale = getLocaleFromCookieValue(jar.get("locale")?.value);
  const session = await getSession();
  if (!session) redirect(getAuthHref(locale, "login", `/admin/courses/${id}`));
  if (session.user.role !== "admin") redirect("/dashboard");


  // Fetch course (include unpublished)
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, id))
    .limit(1);

  if (!course) notFound();

  // Fetch videos ordered by sort_order
  const courseVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.courseId, id))
    .orderBy(videos.sortOrder);

  // Fetch learning content count per video
  const contentCounts = await db
    .select({
      videoId: learningContent.videoId,
      count: count(),
    })
    .from(learningContent)
    .groupBy(learningContent.videoId);

  const contentCountMap = new Map<string, number>(
    contentCounts.map((row) => [row.videoId, Number(row.count)])
  );

  // Total possible content types
  const TOTAL_CONTENT_TYPES = 4;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span aria-hidden="true">←</span> Admin Dashboard
        </Link>
      </div>

      {/* Page heading */}
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Edit:{" "}
        <span className="text-primary">{course.title}</span>
      </h1>

      {/* Course form section */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm mb-10">
        <CourseForm
          course={{
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl,
            category: course.category,
            educatorName: course.educatorName,
            isPublished: course.isPublished,
            sortOrder: course.sortOrder,
          }}
        />
      </section>

      {/* Divider */}
      <div className="border-t border-border mb-8" />

      {/* Videos section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Videos{" "}
            <span className="font-mono text-base font-normal text-muted-foreground">
              ({courseVideos.length})
            </span>
          </h2>
          {/* + Add Video placeholder for future */}
          <span className="text-sm text-muted-foreground italic">+ Add Video (coming soon)</span>
        </div>

        {courseVideos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
            <p className="text-muted-foreground text-sm">No videos yet for this course.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-foreground w-12">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground w-28">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground w-28">Content</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseVideos.map((video, idx) => {
                  const contentCount = contentCountMap.get(video.id) ?? 0;
                  return (
                    <tr
                      key={video.id}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {video.sortOrder ?? idx + 1}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">{video.title}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {formatDuration(video.durationSec)}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {contentCount}/{TOTAL_CONTENT_TYPES}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/courses/${course.id}/videos/${video.id}`}
                          className="inline-flex items-center rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-muted/40 transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
