import Link from "next/link";
import type {
  CourseSeries,
  SupportedLocale,
} from "@/lib/course-content/types";
import { getUiCopy } from "@/lib/course-content/ui-copy";

interface LocalizedCourseCardProps {
  course: CourseSeries;
  locale: SupportedLocale;
}

function getEpisodeLabel(locale: SupportedLocale, count: number) {
  if (locale === "ru") {
    return count === 1 ? "выпуск" : "выпуска";
  }

  if (locale === "uz") {
    return "qism";
  }

  return count === 1 ? "episode" : "episodes";
}

export function LocalizedCourseCard({
  course,
  locale,
}: LocalizedCourseCardProps) {
  const copy = getUiCopy(locale);

  return (
    <article className="rounded-[var(--shape-radius-xl)] border border-border bg-card/90 p-6 shadow-[var(--shadow-md)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        EduPulse Series
      </p>
      <h2 className="mt-4 font-heading text-3xl text-foreground">
        {course.title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[color:var(--text-secondary)]">
        {course.description}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-[color:var(--text-secondary)]">
          {course.episodes.length} {getEpisodeLabel(locale, course.episodes.length)}
        </span>
        <Link
          href={`/${locale}/courses/${course.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--edu-accent-hover)]"
        >
          {copy.openSeries}
        </Link>
      </div>
    </article>
  );
}
