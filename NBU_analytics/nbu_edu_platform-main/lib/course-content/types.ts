export const supportedLocales = ["ru", "uz", "en"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export interface LocalizedText {
  ru: string;
  uz: string;
  en: string;
}

export interface CourseEpisode {
  slug: string;
  contentLocale: SupportedLocale;
  title: string;
  description: string;
  localeNotice: string | null;
  transcript: string;
  videoUrl: string;
  quiz: QuizArtifact;
  flashcards: FlashcardsArtifact;
  mentalMap: MindMapArtifact;
  test: QuizArtifact;
}

export interface CourseSeries {
  slug: string;
  title: string;
  description: string;
  episodes: CourseEpisode[];
}

export interface QuizAnswerOption {
  text: string;
  isCorrect: boolean;
  rationale: string;
}

export interface QuizQuestion {
  question: string;
  answerOptions: QuizAnswerOption[];
  hint?: string;
}

export interface QuizArtifact {
  title: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardsArtifact {
  title: string;
  cards: Flashcard[];
}

export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}

export interface MindMapArtifact {
  root: MindMapNode;
}
