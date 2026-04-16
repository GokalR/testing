export {
  defaultLocale,
  getLocalizedText,
  isSupportedLocale,
  resolveLocale,
} from "@/react-edu/lib/course-content/locales";
export { getCourseSeries } from "@/react-edu/lib/course-content/course-series";
export {
  getCourseBySlug,
  getEpisodeBySlug,
  getStaticCourseRouteParams,
  getStaticLocaleParams,
} from "@/react-edu/lib/course-content/course-series";
export {
  getDashboardLabels,
  getFlashcardLabels,
  getHeaderLabels,
  getLocaleSwitchLabel,
  getMindMapLabels,
  getQuizLabels,
  getUiCopy,
} from "@/react-edu/lib/course-content/ui-copy";
export type {
  DashboardLabels,
  FlashcardLabels,
  HeaderLabels,
  MindMapLabels,
  QuizLabels,
} from "@/react-edu/lib/course-content/ui-copy";
export type {
  CourseEpisode,
  CourseSeries,
  LocalizedText,
  MindMapArtifact,
  MindMapNode,
  SupportedLocale,
} from "@/react-edu/lib/course-content/types";
