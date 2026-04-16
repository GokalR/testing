export {
  defaultLocale,
  getLocalizedText,
  isSupportedLocale,
  resolveLocale,
} from "@/lib/course-content/locales";
export { getCourseSeries } from "@/lib/course-content/course-series";
export {
  getCourseBySlug,
  getEpisodeBySlug,
  getStaticCourseRouteParams,
  getStaticLocaleParams,
} from "@/lib/course-content/course-series";
export {
  getDashboardLabels,
  getFlashcardLabels,
  getHeaderLabels,
  getLocaleSwitchLabel,
  getMindMapLabels,
  getQuizLabels,
  getUiCopy,
} from "@/lib/course-content/ui-copy";
export type {
  DashboardLabels,
  FlashcardLabels,
  HeaderLabels,
  MindMapLabels,
  QuizLabels,
} from "@/lib/course-content/ui-copy";
export type {
  CourseEpisode,
  CourseSeries,
  LocalizedText,
  MindMapArtifact,
  MindMapNode,
  SupportedLocale,
} from "@/lib/course-content/types";
