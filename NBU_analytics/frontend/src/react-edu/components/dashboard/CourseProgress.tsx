import Image from "@/react-edu/adapters/image";
import Link from "@/react-edu/adapters/router";
import { cn } from "@/react-edu/lib/utils";
import type { DashboardLabels } from "@/react-edu/lib/course-content/ui-copy";

interface EnrolledCourse {
  courseId: string;
  title: string;
  thumbnailUrl: string | null;
  category: string | null;
  educatorName: string | null;
  totalVideos: number;
  completedVideos: number;
  progressPercent: number;
  lastWatchedVideoId: string | null;
  lastWatchedVideoTitle: string | null;
}

interface CourseProgressProps {
  courses: EnrolledCourse[];
  labels: DashboardLabels;
  coursesHref: string;
}

export function CourseProgress({ courses, labels, coursesHref }: CourseProgressProps) {
  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm p-8 text-center">
        <p className="text-muted-foreground mb-4">{labels.noCourses}</p>
        <Link
          href={coursesHref}
          className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {labels.browseCourses}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <div
          key={course.courseId}
          className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
          {/* Thumbnail */}
          <div className="relative w-full aspect-video bg-secondary">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">{labels.noThumbnail}</span>
              </div>
            )}
            {course.category && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground border border-border">
                {course.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground leading-snug line-clamp-2">
                {course.title}
              </h3>
              {course.educatorName && (
                <p className="text-sm text-muted-foreground mt-0.5">{course.educatorName}</p>
              )}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {course.completedVideos} {labels.of} {course.totalVideos} {labels.lessonsCompleted}
                </span>
                <span className="font-mono font-bold text-foreground">
                  {course.progressPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Continue Watching */}
            {course.lastWatchedVideoId && (
              <div className="mt-auto pt-2">
                <Link
                  href={`/courses/${course.courseId}/learn/${course.lastWatchedVideoId}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-medium",
                    "text-primary hover:underline underline-offset-4 transition-colors"
                  )}
                >
                  <span>{labels.continueWatching}</span>
                  {course.lastWatchedVideoTitle && (
                    <span className="text-muted-foreground font-normal truncate max-w-[180px]">
                      — {course.lastWatchedVideoTitle}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
