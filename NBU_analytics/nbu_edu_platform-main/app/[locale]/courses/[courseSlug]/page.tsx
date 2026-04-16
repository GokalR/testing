import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionPanel } from "@/components/courses/SectionPanel";
import { getAuthHref } from "@/lib/auth/auth-routing";
import { EnrollButton } from "@/components/courses/EnrollButton";
import {
  getCourseBySlug,
  getStaticCourseRouteParams,
  getUiCopy,
  isSupportedLocale,
} from "@/lib/course-content";
import {
  COURSE_SLUG_TO_DB_ID,
} from "@/lib/course-content/constants";
import type { SupportedLocale } from "@/lib/course-content";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return getStaticCourseRouteParams().map(({ locale, courseSlug }) => ({
    locale,
    courseSlug,
  }));
}

export default async function CourseDetailPage({
  params,
}: PageProps<"/[locale]/courses/[courseSlug]">) {
  const { locale, courseSlug } = await params;
  assertValidLocale(locale);

  const course = getCourseBySlug(locale, courseSlug);
  if (!course) {
    notFound();
  }

  const copy = getUiCopy(locale);
  const dbCourseId = COURSE_SLUG_TO_DB_ID[courseSlug];

  return (
    <main className="px-5 pb-16 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <SectionPanel eyebrow="EduPulse" title={course.title}>
          <p className="text-base leading-8">{course.description}</p>
          {dbCourseId && (
            <div className="mt-5">
              <EnrollButton
                courseId={dbCourseId}
                labels={{
                  enroll: copy.enrollLabel,
                  enrolled: copy.enrolledLabel,
                  signIn: copy.signInToEnrollLabel,
                }}
                signInHref={getAuthHref(
                  locale,
                  "login",
                  `/${locale}/courses/${course.slug}`,
                )}
              />
            </div>
          )}
        </SectionPanel>

        <SectionPanel title={copy.episodeListLabel}>
          <div className="flex flex-col gap-4">
            {course.episodes.map((episode) => {
              const learnHref = dbCourseId
                ? `/courses/${courseSlug}/learn/${episode.slug}`
                : `/${locale}/courses/${course.slug}/learn/${episode.slug}`;

              return (
                <article
                  key={episode.slug}
                  className="rounded-[var(--shape-radius-lg)] border border-border bg-background/70 p-5"
                >
                  <h2 className="font-heading text-2xl text-foreground">
                    {episode.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                    {episode.description}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={learnHref}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--edu-accent-hover)]"
                    >
                      {copy.watchEpisode}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionPanel>
      </div>
    </main>
  );
}
