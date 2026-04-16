
import Link from "@/react-edu/adapters/router";
import { motion } from "framer-motion";
import { cn } from "@/react-edu/lib/utils";

interface Lesson {
  id: string;
  title: string;
  durationSec: number | null;
  sortOrder: number | null;
}

interface LessonListProps {
  lessons: Lesson[];
  currentVideoId: string;
  courseId: string;
  completedVideoIds: string[];
  lessonsLabel?: string;
  /** Maps video DB IDs to URL slugs for clean URLs */
  videoSlugMap?: Record<string, string>;
}

function formatDuration(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function CheckmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-emerald-500"
    >
      <circle cx="7" cy="7" r="7" fill="currentColor" opacity="0.15" />
      <path
        d="M4 7l2.2 2.2L10 4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayingDot() {
  return (
    <motion.span
      className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary"
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: [0.4, 0, 0.6, 1],
      }}
      aria-hidden="true"
    />
  );
}

export function LessonList({
  lessons,
  currentVideoId,
  courseId,
  completedVideoIds,
  lessonsLabel,
  videoSlugMap,
}: LessonListProps) {
  const sorted = [...lessons].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  // Determine the index of the current lesson to decide "not yet reached"
  const currentIndex = sorted.findIndex((l) => l.id === currentVideoId);

  return (
    <div className="flex h-full flex-col">
      {/* Fixed header */}
      <div className="shrink-0 border-b border-border px-4 py-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {lessonsLabel ?? "Lessons"}
        </span>
      </div>

      {/* Scrollable list */}
      <ol className="flex-1 overflow-y-auto">
        {sorted.map((lesson, index) => {
          const isCurrent = lesson.id === currentVideoId;
          const isCompleted = completedVideoIds.includes(lesson.id);
          const isAhead = index > currentIndex && currentIndex !== -1;

          return (
            <li key={lesson.id}>
              <Link
                href={`/courses/${courseId}/learn/${videoSlugMap?.[lesson.id] ?? lesson.id}`}
                className={cn(
                  "group relative flex items-start gap-3 px-4 py-3",
                  "transition-colors duration-150",
                  "border-l-2",
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-secondary/60",
                  isAhead && !isCompleted && "opacity-60"
                )}
                aria-current={isCurrent ? "page" : undefined}
              >
                {/* Lesson number or status icon */}
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center",
                    "rounded-full text-[11px] font-semibold tabular-nums",
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>

                {/* Title + duration */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium leading-snug",
                      isCurrent
                        ? "text-foreground"
                        : isAhead && !isCompleted
                          ? "text-muted-foreground"
                          : "text-foreground"
                    )}
                  >
                    {lesson.title}
                  </p>

                  {lesson.durationSec !== null && (
                    <span className="mt-0.5 inline-block rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {formatDuration(lesson.durationSec)}
                    </span>
                  )}
                </div>

                {/* Right-side indicators */}
                <div className="mt-0.5 flex shrink-0 items-center gap-1.5">
                  {isCompleted && <CheckmarkIcon />}
                  {isCurrent && <PlayingDot />}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
