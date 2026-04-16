import { notFound, redirect } from "next/navigation";
import {
  getStaticCourseRouteParams,
  isSupportedLocale,
} from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";
import {
  COURSE_SLUG_TO_DB_ID,
  DB_VIDEO_ID_TO_EPISODE_SLUG,
} from "@/lib/course-content/constants";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return getStaticCourseRouteParams();
}

/**
 * Redirect locale-based learn URLs to the canonical DB-based URL.
 * e.g. /ru/courses/digital-culture-bank/learn/episode-1-data-foundation
 *   → /courses/00000000-.../learn/00000000-...
 */
export default async function LearningPageRedirect({
  params,
}: PageProps<"/[locale]/courses/[courseSlug]/learn/[videoSlug]">) {
  const { locale, courseSlug, videoSlug } = await params;
  assertValidLocale(locale);

  const dbCourseId = COURSE_SLUG_TO_DB_ID[courseSlug];
  if (!dbCourseId) {
    notFound();
  }

  // Find the DB video ID from the episode slug (reverse lookup)
  const dbVideoId = Object.entries(DB_VIDEO_ID_TO_EPISODE_SLUG).find(
    ([, slug]) => slug === videoSlug,
  )?.[0];

  if (!dbVideoId) {
    notFound();
  }

  redirect(`/courses/${dbCourseId}/learn/${dbVideoId}`);
}
