import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedCourseCard } from "@/components/courses/LocalizedCourseCard";
import {
  getCourseSeries,
  getUiCopy,
  isSupportedLocale,
} from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const course = getCourseSeries(locale);
  return {
    title: course.title,
    description: course.description,
  };
}

export default async function LocaleHomePage({
  params,
}: PageProps<"/[locale]">) {
  const { locale } = await params;
  assertValidLocale(locale);

  const copy = getUiCopy(locale);
  const course = getCourseSeries(locale);

  return (
    <main className="px-5 pb-16 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="rounded-[calc(var(--shape-radius-xl)+6px)] border border-border bg-card/85 p-8 shadow-[var(--shadow-lg)]">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
            {copy.homeEyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-tight text-foreground sm:text-6xl">
            {copy.homeTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--text-secondary)]">
            {copy.homeDescription}
          </p>
        </section>

        <LocalizedCourseCard course={course} locale={locale} />
      </div>
    </main>
  );
}
