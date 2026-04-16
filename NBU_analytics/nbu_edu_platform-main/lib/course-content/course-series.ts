import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
// Episode 1
import ep1Flashcards from "@/lib/course-content/generated/episode-1/flashcards.json";
import ep1MindMap from "@/lib/course-content/generated/episode-1/mind-map.json";
import ep1Quiz from "@/lib/course-content/generated/episode-1/quiz.json";
import ep1Test from "@/lib/course-content/generated/episode-1/test.json";
// Episode 2
import ep2Flashcards from "@/lib/course-content/generated/episode-2/flashcards.json";
import ep2MindMap from "@/lib/course-content/generated/episode-2/mind-map.json";
import ep2Quiz from "@/lib/course-content/generated/episode-2/quiz.json";
import ep2Test from "@/lib/course-content/generated/episode-2/test.json";
// Episode 3
import ep3Flashcards from "@/lib/course-content/generated/episode-3/flashcards.json";
import ep3MindMap from "@/lib/course-content/generated/episode-3/mind-map.json";
import ep3Quiz from "@/lib/course-content/generated/episode-3/quiz.json";
import ep3Test from "@/lib/course-content/generated/episode-3/test.json";
// Episode 4
import ep4Flashcards from "@/lib/course-content/generated/episode-4/flashcards.json";
import ep4MindMap from "@/lib/course-content/generated/episode-4/mind-map.json";
import ep4Quiz from "@/lib/course-content/generated/episode-4/quiz.json";
import ep4Test from "@/lib/course-content/generated/episode-4/test.json";
// Episode 5
import ep5Flashcards from "@/lib/course-content/generated/episode-5/flashcards.json";
import ep5MindMap from "@/lib/course-content/generated/episode-5/mind-map.json";
import ep5Quiz from "@/lib/course-content/generated/episode-5/quiz.json";
import ep5Test from "@/lib/course-content/generated/episode-5/test.json";
import {
  defaultLocale,
  getLocalizedText,
  resolveLocale,
} from "@/lib/course-content/locales";
import type {
  CourseEpisode,
  CourseSeries,
  FlashcardsArtifact,
  LocalizedText,
  MindMapArtifact,
  MindMapNode,
  QuizArtifact,
  SupportedLocale,
} from "@/lib/course-content/types";

// ── Shared text ──────────────────────────────────────────

const seriesTitle: LocalizedText = {
  ru: "Цифровая культура банка",
  uz: "Bankning raqamli madaniyati",
  en: "Digital Culture of the Bank",
};

const seriesDescription: LocalizedText = {
  ru: "Серия о том, как данные, точность операций и культура качества влияют на сервис, риски и устойчивость банка.",
  uz: "Ma'lumotlar, operatsiyalar aniqligi va sifat madaniyati bank servisi, xavflari va barqarorligiga qanday ta'sir qilishini tushuntiruvchi turkum.",
  en: "A series on how data, operational accuracy, and data-quality culture shape bank service, risk, and resilience.",
};

const localeNotice: Record<Exclude<SupportedLocale, "ru">, string> = {
  uz: "Ushbu dars kontenti hozircha rus tilida mavjud.",
  en: "This lesson content is currently available in Russian.",
};

// ── Per-episode titles and descriptions ──────────────────

interface EpisodeMetadata {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  videoUrl: string;
}

const EPISODES_META: EpisodeMetadata[] = [
  {
    slug: "episode-1-data-foundation",
    title: {
      ru: "Выпуск 1 — Данные как основа банковской работы",
      uz: "1-son — Ma'lumotlar bank faoliyatining asosi",
      en: "Episode 1 — Data as the Foundation of Banking Operations",
    },
    description: {
      ru: "Первый выпуск объясняет, какие параметры операции становятся банковскими данными, как ошибки распространяются по системам и почему качество ввода влияет на сервис и контроль рисков.",
      uz: "Birinchi son operatsiya parametrlari qanday qilib bank ma'lumotlariga aylanishini, xatolar tizimlar bo'ylab qanday tarqalishini va kiritish sifati servis hamda xavf nazoratiga nega ta'sir qilishini tushuntiradi.",
      en: "The first episode explains which transaction attributes become bank data, how errors cascade through systems, and why input quality affects service and risk control.",
    },
    videoUrl: "/videos/digital-culture-bank/episode-1-ru.mp4",
  },
  {
    slug: "episode-2-data-warehouse",
    title: {
      ru: "Выпуск 2 — Корпоративное хранилище данных",
      uz: "2-son — Korporativ ma'lumotlar ombori",
      en: "Episode 2 — Corporate Data Warehouse",
    },
    description: {
      ru: "Архитектура корпоративного хранилища данных, ETL-процессы, витрины данных и роль аналитики в принятии решений.",
      uz: "Korporativ ma'lumotlar ombori arxitekturasi, ETL jarayonlari, ma'lumotlar vitrinlari va tahlilning qaror qabul qilishdagi roli.",
      en: "Corporate data warehouse architecture, ETL processes, data marts, and the role of analytics in decision-making.",
    },
    videoUrl: "/videos/digital-culture-bank/episode-2-ru.mp4",
  },
  {
    slug: "episode-3-data-types",
    title: {
      ru: "Выпуск 3 — Типы данных",
      uz: "3-son — Ma'lumotlar turlari",
      en: "Episode 3 — Data Types",
    },
    description: {
      ru: "Структурированные, неструктурированные данные и метаданные: классификация, примеры и роль в банковских процессах.",
      uz: "Tuzilgan, tuzilmagan ma'lumotlar va metama'lumotlar: tasniflash, misollar va bank jarayonlaridagi roli.",
      en: "Structured, unstructured data, and metadata: classification, examples, and their role in banking processes.",
    },
    videoUrl: "/videos/digital-culture-bank/episode-3-ru.mp4",
  },
  {
    slug: "episode-4-data-journey",
    title: {
      ru: "Выпуск 4 — Путь данных: от действия до решения",
      uz: "4-son — Ma'lumotlar yo'li: harakatdan qarorga",
      en: "Episode 4 — Data Journey: From Action to Decision",
    },
    description: {
      ru: "Этапы обработки данных — от первичного ввода через верификацию и агрегацию до управленческих решений.",
      uz: "Ma'lumotlarni qayta ishlash bosqichlari — birlamchi kiritishdan tekshirish va agregatsiyagacha, boshqaruv qarorlarigacha.",
      en: "Data processing stages — from primary input through verification and aggregation to management decisions.",
    },
    videoUrl: "/videos/digital-culture-bank/episode-4-ru.mp4",
  },
  {
    slug: "episode-5-data-quality",
    title: {
      ru: "Выпуск 5 — Качество данных",
      uz: "5-son — Ma'lumotlar sifati",
      en: "Episode 5 — Data Quality",
    },
    description: {
      ru: "Точность, своевременность, полнота и согласованность данных — метрики качества и их влияние на бизнес-процессы банка.",
      uz: "Ma'lumotlarning aniqligi, o'z vaqtidaligi, to'liqligi va izchilligi — sifat metrikalari va ularning bank biznes-jarayonlariga ta'siri.",
      en: "Accuracy, timeliness, completeness, and consistency — quality metrics and their impact on bank business processes.",
    },
    videoUrl: "/videos/digital-culture-bank/episode-5-ru.mp4",
  },
];

// ── Normalization helpers ────────────────────────────────

function cleanTranscript(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line !== "Helvetica Neue")
    .join("\n");
}

function normalizeQuiz(value: unknown): QuizArtifact {
  const quiz = value as QuizArtifact;
  return {
    title: quiz.title,
    questions: quiz.questions,
  };
}

function normalizeFlashcards(value: unknown): FlashcardsArtifact {
  const flashcards = value as FlashcardsArtifact;
  return {
    title: flashcards.title,
    cards: flashcards.cards,
  };
}

function normalizeMindMap(value: unknown): MindMapNode {
  const node = value as { name: string; children?: unknown[] };
  return {
    label: node.name,
    children: node.children?.map((child) => normalizeMindMap(child)),
  };
}

// ── Load transcript from file ────────────────────────────

const GEN_DIR = join(dirname(fileURLToPath(import.meta.url)), "generated");

function loadTranscript(episodeNum: number): string {
  const path = join(GEN_DIR, `episode-${episodeNum}`, "transcript.txt");
  return cleanTranscript(readFileSync(path, "utf8"));
}

// ── Per-episode generated artifacts ──────────────────────

interface EpisodeArtifacts {
  quiz: QuizArtifact;
  flashcards: FlashcardsArtifact;
  mentalMap: MindMapArtifact;
  test: QuizArtifact;
  transcript: string;
}

function buildArtifacts(
  quizRaw: unknown,
  flashcardsRaw: unknown,
  mindMapRaw: unknown,
  testRaw: unknown,
  episodeNum: number,
): EpisodeArtifacts {
  return {
    quiz: normalizeQuiz(quizRaw),
    flashcards: normalizeFlashcards(flashcardsRaw),
    mentalMap: { root: normalizeMindMap(mindMapRaw) },
    test: normalizeQuiz(testRaw),
    transcript: loadTranscript(episodeNum),
  };
}

const EPISODE_ARTIFACTS: EpisodeArtifacts[] = [
  buildArtifacts(ep1Quiz, ep1Flashcards, ep1MindMap, ep1Test, 1),
  buildArtifacts(ep2Quiz, ep2Flashcards, ep2MindMap, ep2Test, 2),
  buildArtifacts(ep3Quiz, ep3Flashcards, ep3MindMap, ep3Test, 3),
  buildArtifacts(ep4Quiz, ep4Flashcards, ep4MindMap, ep4Test, 4),
  buildArtifacts(ep5Quiz, ep5Flashcards, ep5MindMap, ep5Test, 5),
];

// ── Public API ───────────────────────────────────────────

function buildEpisode(
  index: number,
  locale: SupportedLocale,
): CourseEpisode {
  const meta = EPISODES_META[index];
  const artifacts = EPISODE_ARTIFACTS[index];
  const resolvedLocaleNotice =
    locale === defaultLocale
      ? null
      : localeNotice[locale as Exclude<SupportedLocale, "ru">];

  return {
    slug: meta.slug,
    contentLocale: defaultLocale,
    title: getLocalizedText(meta.title, locale),
    description: getLocalizedText(meta.description, locale),
    localeNotice: resolvedLocaleNotice,
    transcript: artifacts.transcript,
    videoUrl: meta.videoUrl,
    quiz: artifacts.quiz,
    flashcards: artifacts.flashcards,
    mentalMap: artifacts.mentalMap,
    test: artifacts.test,
  };
}

export function getCourseSeries(locale: SupportedLocale): CourseSeries {
  return {
    slug: "digital-culture-bank",
    title: getLocalizedText(seriesTitle, locale),
    description: getLocalizedText(seriesDescription, locale),
    episodes: EPISODES_META.map((_, i) => buildEpisode(i, locale)),
  };
}

export function getCourseBySlug(locale: string, courseSlug: string) {
  if (courseSlug !== "digital-culture-bank") {
    return null;
  }

  return getCourseSeries(resolveLocale(locale));
}

export function getEpisodeBySlug(
  locale: string,
  courseSlug: string,
  videoSlug: string,
) {
  const course = getCourseBySlug(locale, courseSlug);
  if (!course) {
    return null;
  }

  return course.episodes.find((episode) => episode.slug === videoSlug) ?? null;
}

export function getStaticLocaleParams() {
  return [
    { locale: "ru" },
    { locale: "uz" },
    { locale: "en" },
  ] as const;
}

export function getStaticCourseRouteParams() {
  return getStaticLocaleParams().flatMap(({ locale }) =>
    EPISODES_META.map((meta) => ({
      locale,
      courseSlug: "digital-culture-bank",
      videoSlug: meta.slug,
    })),
  );
}
