import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { getSession } from "@/lib/auth-helpers";
import { getAuthHref, getLocaleFromCookieValue } from "@/lib/auth/auth-routing";
import { db } from "@/lib/db";
import { courses, videos, users, learningContent } from "@/lib/db/schema";
import { count, sql } from "drizzle-orm";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard — EduPulse",
  description: "Manage courses, videos, and platform content.",
};

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default async function AdminPage() {
  const jar = await cookies();
  const locale = getLocaleFromCookieValue(jar.get("locale")?.value);
  const session = await getSession();
  if (!session) redirect(getAuthHref(locale, "login", "/admin"));
  if (session.user.role !== "admin") redirect("/dashboard");

  // Fetch stats in parallel
  const [
    [{ totalCourses }],
    [{ totalVideos }],
    [{ totalStudents }],
    [{ totalContent }],
    courseList,
  ] = await Promise.all([
    db.select({ totalCourses: count() }).from(courses),
    db.select({ totalVideos: count() }).from(videos),
    db
      .select({ totalStudents: count() })
      .from(users)
      .where(sql`${users.role} = 'student'`),
    db.select({ totalContent: count() }).from(learningContent),
    db
      .select({
        id: courses.id,
        title: courses.title,
        category: courses.category,
        educatorName: courses.educatorName,
        isPublished: courses.isPublished,
        sortOrder: courses.sortOrder,
        createdAt: courses.createdAt,
        videoCount: count(videos.id),
      })
      .from(courses)
      .leftJoin(videos, sql`${videos.courseId} = ${courses.id}`)
      .groupBy(
        courses.id,
        courses.title,
        courses.category,
        courses.educatorName,
        courses.isPublished,
        courses.sortOrder,
        courses.createdAt,
      )
      .orderBy(courses.sortOrder, courses.createdAt),
  ]);

  const stats = [
    { label: "Courses", value: totalCourses },
    { label: "Videos", value: totalVideos },
    { label: "Students", value: totalStudents },
    { label: "Content Items", value: totalContent },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Logged in as {session.user.email}
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
            "bg-primary text-primary-foreground shadow-sm",
            "hover:opacity-90 transition-opacity",
          )}
        >
          + Create Course
        </Link>
      </div>

      {/* Stats Row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card px-6 py-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
              {stat.label}
            </p>
            <p className="mt-2 font-mono text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Courses Table */}
      <div className="mt-10 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            All Courses
          </h2>
        </div>

        {courseList.length === 0 ? (
          <div className="px-6 py-16 text-center text-muted-foreground">
            No courses yet. Create your first course to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Educator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Videos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courseList.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground max-w-[200px] truncate">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {course.category ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {course.educatorName ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">
                      {course.videoCount}
                    </td>
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground whitespace-nowrap">
                      {course.createdAt ? formatDate(course.createdAt) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="text-sm font-medium text-primary hover:underline underline-offset-2 transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
