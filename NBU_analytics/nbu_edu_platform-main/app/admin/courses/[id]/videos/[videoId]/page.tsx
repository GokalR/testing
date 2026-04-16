import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, videos, learningContent } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-helpers";
import { getAuthHref, getLocaleFromCookieValue } from "@/lib/auth/auth-routing";
import { VideoForm } from "@/components/admin/VideoForm";
import { ContentEditor } from "@/components/admin/ContentEditor";

interface PageProps {
  params: Promise<{ id: string; videoId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { videoId } = await params;
  const [video] = await db
    .select({ title: videos.title })
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1);

  return {
    title: video ? `Edit Video: ${video.title} — Admin` : "Edit Video — Admin",
  };
}

export default async function AdminVideoEditPage({ params }: PageProps) {
  const { id: courseId, videoId } = await params;
  const jar = await cookies();
  const locale = getLocaleFromCookieValue(jar.get("locale")?.value);
  const session = await getSession();
  if (!session) redirect(getAuthHref(locale, "login", `/admin/courses/${courseId}/videos/${videoId}`));
  if (session.user.role !== "admin") redirect("/dashboard");


  // Fetch course (for breadcrumb)
  const [course] = await db
    .select({ id: courses.id, title: courses.title })
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);

  if (!course) notFound();

  // Fetch video — must belong to this course
  const [video] = await db
    .select()
    .from(videos)
    .where(and(eq(videos.id, videoId), eq(videos.courseId, courseId)))
    .limit(1);

  if (!video) notFound();

  // Fetch all learning content for this video
  const contentRows = await db
    .select()
    .from(learningContent)
    .where(eq(learningContent.videoId, videoId));

  const existingContent = contentRows.map((row) => ({
    id: row.id,
    contentType: row.contentType,
    content: row.content,
  }));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href={`/admin/courses/${courseId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span aria-hidden="true">←</span> {course.title}
        </Link>
      </div>

      {/* Page heading */}
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Edit Video:{" "}
        <span className="text-primary">{video.title}</span>
      </h1>

      {/* Video form section */}
      <section className="rounded-xl border border-border bg-card shadow-sm p-6 mb-8">
        <VideoForm
          video={{
            id: video.id,
            courseId: video.courseId,
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            durationSec: video.durationSec,
            transcript: video.transcript,
            sortOrder: video.sortOrder,
          }}
        />
      </section>

      {/* Divider */}
      <div className="border-t border-border mb-8" />

      {/* Learning content section */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
          Learning Content
        </h2>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <ContentEditor videoId={videoId} existingContent={existingContent} />
        </div>
      </section>
    </main>
  );
}
