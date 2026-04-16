import { notFound } from "next/navigation";
import { LocalizedCourseCard } from "@/components/courses/LocalizedCourseCard";
import {
  getCourseSeries,
  isSupportedLocale,
} from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export default async function CoursesPage({
  params,
}: PageProps<"/[locale]/courses">) {
  const { locale } = await params;
  assertValidLocale(locale);

  const course = getCourseSeries(locale);

  return (
    <main className="px-5 pb-16 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <LocalizedCourseCard course={course} locale={locale} />
      </div>
    </main>
  );
}
