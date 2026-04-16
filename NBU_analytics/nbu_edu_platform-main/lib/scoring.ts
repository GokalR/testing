// Scoring utility for quiz and test grading — pure functions, no DB or API calls

export interface QuizQuestion {
  id: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  difficulty: string;
  explanation: string;
}

export interface QuizCorrection {
  selected: string;
  correct: string;
  isCorrect: boolean;
}

export interface QuizGradeResult {
  scorePercent: number;
  corrections: Record<string, QuizCorrection>;
}

export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, string>
): QuizGradeResult {
  const corrections: Record<string, QuizCorrection> = {};
  let correct = 0;

  for (const q of questions) {
    const selected = answers[q.id] ?? "";
    const isCorrect = selected === q.correct;
    if (isCorrect) correct++;
    corrections[q.id] = {
      selected,
      correct: q.correct,
      isCorrect,
    };
  }

  const scorePercent =
    questions.length === 0
      ? 0
      : Math.round((correct / questions.length) * 100);

  return { scorePercent, corrections };
}

export interface TestQuestion {
  id: string;
  type: "mcq" | "true_false";
  question: string;
  options?: Record<string, string>;
  correct_answer: string;
  points: number;
  difficulty: string;
}

export interface TestCorrection {
  selected: string;
  correct: string;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
}

export interface TestGradeResult {
  scorePercent: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  corrections: Record<string, TestCorrection>;
}

export function gradeTest(
  questions: TestQuestion[],
  answers: Record<string, string>,
  passingScorePercent: number = 70
): TestGradeResult {
  const corrections: Record<string, TestCorrection> = {};
  let totalPoints = 0;
  let earnedPoints = 0;

  for (const q of questions) {
    const selected = answers[q.id] ?? "";
    const isCorrect = selected === q.correct_answer;
    const pts = q.points ?? 1;
    const earned = isCorrect ? pts : 0;
    totalPoints += pts;
    earnedPoints += earned;
    corrections[q.id] = {
      selected,
      correct: q.correct_answer,
      isCorrect,
      points: pts,
      earnedPoints: earned,
    };
  }

  const scorePercent =
    totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);

  return {
    scorePercent,
    totalPoints,
    earnedPoints,
    passed: scorePercent >= passingScorePercent,
    corrections,
  };
}
