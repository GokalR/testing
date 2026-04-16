import { getLocalizedText } from "@/react-edu/lib/course-content/locales";
import type { LocalizedText, SupportedLocale } from "@/react-edu/lib/course-content/types";

const homeEyebrow: LocalizedText = {
  ru: "Образовательная платформа НБУ",
  uz: "O’zMB ta’lim platformasi",
  en: "NBU Educational Platform",
};

const homeTitle: LocalizedText = {
  ru: "EduPulse — цифровое обучение для сотрудников банка.",
  uz: "EduPulse — bank xodimlari uchun raqamli ta’lim.",
  en: "EduPulse — digital learning for bank employees.",
};

const homeDescription: LocalizedText = {
  ru: "Видеокурсы, квизы, флешкарточки и ментальные карты на основе реальных материалов Национального банка Узбекистана. Учитесь в удобном темпе.",
  uz: "O’zbekiston Milliy bankining haqiqiy materiallari asosidagi videokurslar, kvizlar, fleshkartalar va mental xaritalar. O’zingizga qulay tezlikda o’rganing.",
  en: "Video courses, quizzes, flashcards, and mind maps built from real National Bank of Uzbekistan materials. Learn at your own pace.",
};

const openSeries: LocalizedText = {
  ru: "Открыть серию",
  uz: "Turkumni ochish",
  en: "Open series",
};

const browseCourses: LocalizedText = {
  ru: "Все курсы",
  uz: "Barcha kurslar",
  en: "All courses",
};

const watchEpisode: LocalizedText = {
  ru: "Смотреть выпуск",
  uz: "Qismni ko‘rish",
  en: "Watch episode",
};

const lessonMaterials: LocalizedText = {
  ru: "Материалы урока",
  uz: "Dars materiallari",
  en: "Lesson materials",
};

const transcriptLabel: LocalizedText = {
  ru: "Сценарий и ключевые тезисы",
  uz: "Ssenariy va asosiy tezislar",
  en: "Transcript and key points",
};

const quizLabel: LocalizedText = {
  ru: "Квиз",
  uz: "Kviza",
  en: "Quiz",
};

const flashcardsLabel: LocalizedText = {
  ru: "Флешкарточки",
  uz: "Fleshkartalar",
  en: "Flashcards",
};

const mentalMapLabel: LocalizedText = {
  ru: "Ментальная карта",
  uz: "Mental xarita",
  en: "Mental map",
};

const testLabel: LocalizedText = {
  ru: "Итоговый тест",
  uz: "Yakuniy test",
  en: "Final test",
};

const availableInRussian: LocalizedText = {
  ru: "",
  uz: "Asosiy dars materiali hozircha rus tilida qoladi, ammo quyida to‘liq ko‘rish mumkin.",
  en: "The core lesson materials remain in Russian for now, but they stay fully accessible below.",
};

const episodeListLabel: LocalizedText = {
  ru: "Выпуски серии",
  uz: "Turkum qismlari",
  en: "Series episodes",
};

const enrollLabel: LocalizedText = {
  ru: "Записаться на курс",
  uz: "Kursga yozilish",
  en: "Enroll in Course",
};

const enrolledLabel: LocalizedText = {
  ru: "Вы записаны ✓",
  uz: "Siz yozildingiz ✓",
  en: "Enrolled ✓",
};

const signInToEnrollLabel: LocalizedText = {
  ru: "Войти для записи",
  uz: "Yozilish uchun kiring",
  en: "Sign in to Enroll",
};

const lessonsListLabel: LocalizedText = {
  ru: "Уроки",
  uz: "Darslar",
  en: "Lessons",
};

const backLabel: LocalizedText = {
  ru: "Назад",
  uz: "Orqaga",
  en: "Back",
};

const localeNames: Record<SupportedLocale, LocalizedText> = {
  ru: { ru: "Русский", uz: "Ruscha", en: "Russian" },
  uz: { ru: "Узбекский", uz: "O‘zbekcha", en: "Uzbek" },
  en: { ru: "Английский", uz: "Inglizcha", en: "English" },
};

/* ── Interactive learning component labels ─────────────── */

const checkAnswer: LocalizedText = {
  ru: "Проверить",
  uz: "Tekshirish",
  en: "Check Answer",
};
const next: LocalizedText = { ru: "Далее", uz: "Keyingisi", en: "Next" };
const seeResults: LocalizedText = {
  ru: "Результаты",
  uz: "Natijalar",
  en: "See Results",
};
const retryQuiz: LocalizedText = {
  ru: "Пройти заново",
  uz: "Qayta boshlash",
  en: "Retry Quiz",
};
const explanation: LocalizedText = {
  ru: "Пояснение:",
  uz: "Izoh:",
  en: "Explanation:",
};
const questionOf: LocalizedText = {
  ru: "Вопрос",
  uz: "Savol",
  en: "Q",
};
const ofTotal: LocalizedText = { ru: "из", uz: "/", en: "of" };
const scoreLabel: LocalizedText = {
  ru: "баллы",
  uz: "ball",
  en: "score",
};
const resultExcellent: LocalizedText = {
  ru: "Отлично!",
  uz: "A'lo!",
  en: "Excellent!",
};
const resultGood: LocalizedText = {
  ru: "Хорошо!",
  uz: "Yaxshi!",
  en: "Good job!",
};
const resultKeepPracticing: LocalizedText = {
  ru: "Нужно повторить!",
  uz: "Takrorlash kerak!",
  en: "Keep practicing!",
};

const front: LocalizedText = { ru: "Лицо", uz: "Old", en: "Front" };
const back: LocalizedText = { ru: "Оборот", uz: "Orqa", en: "Back" };
const clickToFlip: LocalizedText = {
  ru: "Нажмите, чтобы перевернуть",
  uz: "Aylantrish uchun bosing",
  en: "Click to flip",
};
const again: LocalizedText = {
  ru: "Повторить",
  uz: "Qayta",
  en: "Again",
};
const hard: LocalizedText = { ru: "Сложно", uz: "Qiyin", en: "Hard" };
const good: LocalizedText = { ru: "Хорошо", uz: "Yaxshi", en: "Good" };
const easy: LocalizedText = { ru: "Легко", uz: "Oson", en: "Easy" };
const reviewComplete: LocalizedText = {
  ru: "Повторение завершено!",
  uz: "Takrorlash tugadi!",
  en: "Review Complete!",
};
const cardsReviewed: LocalizedText = {
  ru: "карточек изучено",
  uz: "karta ko'rib chiqildi",
  en: "cards reviewed",
};
const restartDeck: LocalizedText = {
  ru: "Начать заново",
  uz: "Qayta boshlash",
  en: "Restart Deck",
};

const nodeDetail: LocalizedText = {
  ru: "Узел",
  uz: "Tugun",
  en: "Node Detail",
};
const concept: LocalizedText = {
  ru: "Понятие",
  uz: "Tushuncha",
  en: "Concept",
};

export interface QuizLabels {
  checkAnswer: string;
  next: string;
  seeResults: string;
  retryQuiz: string;
  explanation: string;
  questionOf: string;
  ofTotal: string;
  scoreLabel: string;
  resultExcellent: string;
  resultGood: string;
  resultKeepPracticing: string;
}

export interface FlashcardLabels {
  front: string;
  back: string;
  clickToFlip: string;
  again: string;
  hard: string;
  good: string;
  easy: string;
  reviewComplete: string;
  cardsReviewed: string;
  restartDeck: string;
}

export interface MindMapLabels {
  nodeDetail: string;
  concept: string;
}

export function getQuizLabels(locale: SupportedLocale): QuizLabels {
  return {
    checkAnswer: getLocalizedText(checkAnswer, locale),
    next: getLocalizedText(next, locale),
    seeResults: getLocalizedText(seeResults, locale),
    retryQuiz: getLocalizedText(retryQuiz, locale),
    explanation: getLocalizedText(explanation, locale),
    questionOf: getLocalizedText(questionOf, locale),
    ofTotal: getLocalizedText(ofTotal, locale),
    scoreLabel: getLocalizedText(scoreLabel, locale),
    resultExcellent: getLocalizedText(resultExcellent, locale),
    resultGood: getLocalizedText(resultGood, locale),
    resultKeepPracticing: getLocalizedText(resultKeepPracticing, locale),
  };
}

export function getFlashcardLabels(locale: SupportedLocale): FlashcardLabels {
  return {
    front: getLocalizedText(front, locale),
    back: getLocalizedText(back, locale),
    clickToFlip: getLocalizedText(clickToFlip, locale),
    again: getLocalizedText(again, locale),
    hard: getLocalizedText(hard, locale),
    good: getLocalizedText(good, locale),
    easy: getLocalizedText(easy, locale),
    reviewComplete: getLocalizedText(reviewComplete, locale),
    cardsReviewed: getLocalizedText(cardsReviewed, locale),
    restartDeck: getLocalizedText(restartDeck, locale),
  };
}

export function getMindMapLabels(locale: SupportedLocale): MindMapLabels {
  return {
    nodeDetail: getLocalizedText(nodeDetail, locale),
    concept: getLocalizedText(concept, locale),
  };
}

/* ── Dashboard labels ──────────────────────────────────── */

const dashWelcome: LocalizedText = {
  ru: "С возвращением,",
  uz: "Xush kelibsiz,",
  en: "Welcome back,",
};
const dashSubtitle: LocalizedText = {
  ru: "Отслеживайте прогресс и продолжайте обучение.",
  uz: "O'z jarayoningizni kuzating va o'rganishni davom ettiring.",
  en: "Track your progress and continue learning.",
};
const dashEnrolled: LocalizedText = {
  ru: "Записаны",
  uz: "Ro'yxatdan",
  en: "Enrolled",
};
const dashCompleted: LocalizedText = {
  ru: "Завершено",
  uz: "Tugatilgan",
  en: "Completed",
};
const dashQuizzesTaken: LocalizedText = {
  ru: "Квизы пройдены",
  uz: "Kvizlar topshirilgan",
  en: "Quizzes Taken",
};
const dashAvgScore: LocalizedText = {
  ru: "Средний балл",
  uz: "O'rtacha ball",
  en: "Avg Score",
};
const dashMyCourses: LocalizedText = {
  ru: "Мои курсы",
  uz: "Mening kurslarim",
  en: "My Courses",
};
const dashBrowseMore: LocalizedText = {
  ru: "Все курсы",
  uz: "Barcha kurslar",
  en: "Browse More",
};
const dashRecentScores: LocalizedText = {
  ru: "Недавние результаты",
  uz: "So'nggi natijalar",
  en: "Recent Scores",
};
const dashFlashcardReviews: LocalizedText = {
  ru: "Повторение карточек",
  uz: "Kartalarni takrorlash",
  en: "Flashcard Reviews",
};
const dashNoCourses: LocalizedText = {
  ru: "Вы ещё не записаны ни на один курс.",
  uz: "Siz hali birorta kursga yozilmagansiz.",
  en: "No courses enrolled yet.",
};
const dashBrowseCourses: LocalizedText = {
  ru: "Все курсы",
  uz: "Barcha kurslar",
  en: "Browse Courses",
};
const dashLessonsCompleted: LocalizedText = {
  ru: "уроков завершено",
  uz: "dars tugatildi",
  en: "lessons completed",
};
const dashContinueWatching: LocalizedText = {
  ru: "Продолжить просмотр",
  uz: "Ko'rishni davom ettirish",
  en: "Continue Watching",
};
const dashNoThumbnail: LocalizedText = {
  ru: "Нет обложки",
  uz: "Rasm yo'q",
  en: "No thumbnail",
};
const dashNoScores: LocalizedText = {
  ru: "Нет пройденных квизов или тестов.",
  uz: "Kviz yoki test natijasi yo'q.",
  en: "No quiz or test attempts yet.",
};
const dashQuiz: LocalizedText = { ru: "Квиз", uz: "Kviz", en: "Quiz" };
const dashTest: LocalizedText = { ru: "Тест", uz: "Test", en: "Test" };
const dashPass: LocalizedText = {
  ru: "Пройдено",
  uz: "O'tdi",
  en: "Pass",
};
const dashFail: LocalizedText = {
  ru: "Не пройдено",
  uz: "O'tmadi",
  en: "Fail",
};
const dashAllCaughtUp: LocalizedText = {
  ru: "Всё повторено! Нет карточек для повторения.",
  uz: "Hammasi takrorlandi! Takrorlash uchun karta yo'q.",
  en: "All caught up! No cards due for review.",
};
const dashCardsDue: LocalizedText = {
  ru: "карт. для повторения",
  uz: "karta takrorlash uchun",
  en: "cards due for review",
};
const dashAndMore: LocalizedText = {
  ru: "и ещё",
  uz: "va yana",
  en: "and more…",
};
const dashReviewCards: LocalizedText = {
  ru: "Повторить",
  uz: "Takrorlash",
  en: "Review",
};
const dashOf: LocalizedText = { ru: "из", uz: "/", en: "of" };
const dashJustNow: LocalizedText = {
  ru: "только что",
  uz: "hozirgina",
  en: "just now",
};
const dashMinAgo: LocalizedText = {
  ru: "мин. назад",
  uz: "min. oldin",
  en: "min ago",
};
const dashHrAgo: LocalizedText = {
  ru: "ч. назад",
  uz: "soat oldin",
  en: "hr ago",
};
const dashDayAgo: LocalizedText = {
  ru: "дн. назад",
  uz: "kun oldin",
  en: "d ago",
};
const dashWeekAgo: LocalizedText = {
  ru: "нед. назад",
  uz: "hafta oldin",
  en: "wk ago",
};
const dashMonthAgo: LocalizedText = {
  ru: "мес. назад",
  uz: "oy oldin",
  en: "mo ago",
};

export interface DashboardLabels {
  welcome: string;
  subtitle: string;
  enrolled: string;
  completed: string;
  quizzesTaken: string;
  avgScore: string;
  myCourses: string;
  browseMore: string;
  recentScores: string;
  flashcardReviews: string;
  noCourses: string;
  browseCourses: string;
  lessonsCompleted: string;
  continueWatching: string;
  noThumbnail: string;
  noScores: string;
  quiz: string;
  test: string;
  pass: string;
  fail: string;
  allCaughtUp: string;
  cardsDue: string;
  andMore: string;
  reviewCards: string;
  of: string;
  justNow: string;
  minAgo: string;
  hrAgo: string;
  dayAgo: string;
  weekAgo: string;
  monthAgo: string;
}

export function getDashboardLabels(locale: SupportedLocale): DashboardLabels {
  return {
    welcome: getLocalizedText(dashWelcome, locale),
    subtitle: getLocalizedText(dashSubtitle, locale),
    enrolled: getLocalizedText(dashEnrolled, locale),
    completed: getLocalizedText(dashCompleted, locale),
    quizzesTaken: getLocalizedText(dashQuizzesTaken, locale),
    avgScore: getLocalizedText(dashAvgScore, locale),
    myCourses: getLocalizedText(dashMyCourses, locale),
    browseMore: getLocalizedText(dashBrowseMore, locale),
    recentScores: getLocalizedText(dashRecentScores, locale),
    flashcardReviews: getLocalizedText(dashFlashcardReviews, locale),
    noCourses: getLocalizedText(dashNoCourses, locale),
    browseCourses: getLocalizedText(dashBrowseCourses, locale),
    lessonsCompleted: getLocalizedText(dashLessonsCompleted, locale),
    continueWatching: getLocalizedText(dashContinueWatching, locale),
    noThumbnail: getLocalizedText(dashNoThumbnail, locale),
    noScores: getLocalizedText(dashNoScores, locale),
    quiz: getLocalizedText(dashQuiz, locale),
    test: getLocalizedText(dashTest, locale),
    pass: getLocalizedText(dashPass, locale),
    fail: getLocalizedText(dashFail, locale),
    allCaughtUp: getLocalizedText(dashAllCaughtUp, locale),
    cardsDue: getLocalizedText(dashCardsDue, locale),
    andMore: getLocalizedText(dashAndMore, locale),
    reviewCards: getLocalizedText(dashReviewCards, locale),
    of: getLocalizedText(dashOf, locale),
    justNow: getLocalizedText(dashJustNow, locale),
    minAgo: getLocalizedText(dashMinAgo, locale),
    hrAgo: getLocalizedText(dashHrAgo, locale),
    dayAgo: getLocalizedText(dashDayAgo, locale),
    weekAgo: getLocalizedText(dashWeekAgo, locale),
    monthAgo: getLocalizedText(dashMonthAgo, locale),
  };
}

/* ── Header labels ─────────────────────────────────────── */

const headerDashboard: LocalizedText = {
  ru: "Панель",
  uz: "Panel",
  en: "Dashboard",
};
const headerSignOut: LocalizedText = {
  ru: "Выход",
  uz: "Chiqish",
  en: "Sign Out",
};
const headerSignIn: LocalizedText = {
  ru: "Войти",
  uz: "Kirish",
  en: "Sign In",
};

export interface HeaderLabels {
  browseCourses: string;
  dashboard: string;
  signOut: string;
  signIn: string;
}

export function getHeaderLabels(locale: SupportedLocale): HeaderLabels {
  return {
    browseCourses: getLocalizedText(browseCourses, locale),
    dashboard: getLocalizedText(headerDashboard, locale),
    signOut: getLocalizedText(headerSignOut, locale),
    signIn: getLocalizedText(headerSignIn, locale),
  };
}

export function getUiCopy(locale: SupportedLocale) {
  return {
    homeEyebrow: getLocalizedText(homeEyebrow, locale),
    homeTitle: getLocalizedText(homeTitle, locale),
    homeDescription: getLocalizedText(homeDescription, locale),
    openSeries: getLocalizedText(openSeries, locale),
    browseCourses: getLocalizedText(browseCourses, locale),
    watchEpisode: getLocalizedText(watchEpisode, locale),
    lessonMaterials: getLocalizedText(lessonMaterials, locale),
    transcriptLabel: getLocalizedText(transcriptLabel, locale),
    quizLabel: getLocalizedText(quizLabel, locale),
    flashcardsLabel: getLocalizedText(flashcardsLabel, locale),
    mentalMapLabel: getLocalizedText(mentalMapLabel, locale),
    testLabel: getLocalizedText(testLabel, locale),
    availableInRussian: getLocalizedText(availableInRussian, locale),
    episodeListLabel: getLocalizedText(episodeListLabel, locale),
    enrollLabel: getLocalizedText(enrollLabel, locale),
    enrolledLabel: getLocalizedText(enrolledLabel, locale),
    signInToEnrollLabel: getLocalizedText(signInToEnrollLabel, locale),
    lessonsListLabel: getLocalizedText(lessonsListLabel, locale),
    backLabel: getLocalizedText(backLabel, locale),
  };
}

export function getLocaleSwitchLabel(
  locale: SupportedLocale,
  targetLocale: SupportedLocale,
) {
  return getLocalizedText(localeNames[targetLocale], locale);
}
