"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  id: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  difficulty: string;
  explanation: string;
}

interface QuizContent {
  questions: QuizQuestion[];
}

interface SubmitResult {
  score_percent: number;
  corrections: Record<
    string,
    { selected: string; correct: string; isCorrect: boolean }
  >;
}

interface QuizViewProps {
  content: QuizContent;
  onSubmit: (answers: Record<string, string>) => Promise<SubmitResult>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function difficultyColor(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d === "easy") return "text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/30";
  if (d === "hard") return "text-[var(--error)] bg-[var(--error)]/10 border-[var(--error)]/30";
  return "text-muted-foreground bg-secondary border-border";
}

function scoreMessage(percent: number): string {
  if (percent >= 85) return "Excellent!";
  if (percent >= 60) return "Good job!";
  return "Keep practicing!";
}

// ── SVG Icons ────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

// ── Score Ring ───────────────────────────────────────────────────────────────

interface ScoreRingProps {
  percent: number;
  correct: number;
  total: number;
}

function ScoreRing({ percent, correct, total }: ScoreRingProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="136"
        height="136"
        viewBox="0 0 136 136"
        fill="none"
        className="rotate-[-90deg]"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="68"
          cy="68"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          className="text-border"
        />
        {/* Progress */}
        <motion.circle
          cx="68"
          cy="68"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className={percent >= 60 ? "text-[var(--success)]" : "text-[var(--error)]"}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-foreground tabular-nums">
          {correct}/{total}
        </span>
        <span className="font-mono text-xs text-muted-foreground">score</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function QuizView({ content, onSubmit }: QuizViewProps) {
  const { questions } = content;
  const total = questions.length;

  // Per-question tracking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back (unused but available)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Results
  const [showResults, setShowResults] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isChecked = checkedQuestions.has(currentQuestion.id);
  const isLastQuestion = currentIndex === total - 1;
  const optionKeys = Object.keys(currentQuestion.options).sort();

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleSelectOption(key: string) {
    if (isChecked) return; // Already checked — locked in
    setSelectedAnswer(key);
  }

  async function handleCheck() {
    if (!selectedAnswer || isChecked) return;

    // Store the answer
    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);
    setCheckedQuestions((prev) => new Set(prev).add(currentQuestion.id));

    // On last question: submit
    if (isLastQuestion) {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(newAnswers);
        setSubmitResult(result);
        setShowResults(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handleNext() {
    if (!isChecked || isLastQuestion) return;
    setDirection(1);
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setDirection(1);
    setSelectedAnswer(null);
    setCheckedQuestions(new Set());
    setAnswers({});
    setShowResults(false);
    setSubmitResult(null);
  }

  // ── Option state helper ──────────────────────────────────────────────────────

  function optionState(key: string): "idle" | "selected" | "correct" | "wrong" | "reveal" {
    if (!isChecked) {
      return key === selectedAnswer ? "selected" : "idle";
    }
    const correctKey = currentQuestion.correct;
    if (key === correctKey) return "correct";
    if (key === selectedAnswer && key !== correctKey) return "wrong";
    return "idle";
  }

  // ── Result-screen data ───────────────────────────────────────────────────────

  const correctCount = submitResult
    ? Object.values(submitResult.corrections).filter((c) => c.isCorrect).length
    : 0;
  const scorePercent = submitResult?.score_percent ?? 0;

  // ── Animation variants ───────────────────────────────────────────────────────

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -48 : 48,
      opacity: 0,
    }),
  };

  // ── Results Screen ───────────────────────────────────────────────────────────

  if (showResults && submitResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col items-center gap-8 py-8 px-4"
      >
        {/* Score ring */}
        <ScoreRing
          percent={scorePercent}
          correct={correctCount}
          total={total}
        />

        {/* Message */}
        <div className="text-center">
          <h3 className="font-heading text-2xl font-bold text-foreground">
            {scoreMessage(scorePercent)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You scored{" "}
            <span className="font-mono font-semibold text-foreground">
              {Math.round(scorePercent)}%
            </span>{" "}
            on this quiz.
          </p>
        </div>

        {/* Per-question breakdown */}
        <div className="w-full max-w-md space-y-2">
          {questions.map((q, i) => {
            const correction = submitResult.corrections[q.id];
            const ok = correction?.isCorrect;
            return (
              <div
                key={q.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3 text-sm",
                  ok
                    ? "border-[var(--success)]/30 bg-[var(--success)]/5"
                    : "border-[var(--error)]/30 bg-[var(--error)]/5"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    ok
                      ? "bg-[var(--success)]/20 text-[var(--success)]"
                      : "bg-[var(--error)]/20 text-[var(--error)]"
                  )}
                >
                  {ok ? <IconCheck /> : <IconX />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground leading-snug">
                    Q{i + 1}. {q.question}
                  </p>
                  {!ok && correction && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your answer:{" "}
                      <span className="font-mono text-[var(--error)]">
                        {correction.selected}
                      </span>{" "}
                      &mdash; Correct:{" "}
                      <span className="font-mono text-[var(--success)]">
                        {correction.correct}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Retry button */}
        <button
          type="button"
          onClick={handleRetry}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-2.5",
            "bg-primary text-primary-foreground font-medium text-sm",
            "hover:opacity-90 transition-opacity duration-150"
          )}
        >
          <IconRefresh />
          Retry Quiz
        </button>
      </motion.div>
    );
  }

  // ── Quiz Screen ──────────────────────────────────────────────────────────────

  const progressPercent = ((currentIndex + (isChecked ? 1 : 0)) / total) * 100;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Animated question card */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col gap-4"
          >
            {/* Question header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5">
                  Q{currentIndex + 1} of {total}
                </span>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  difficultyColor(currentQuestion.difficulty)
                )}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Question text */}
            <p className="font-heading text-lg font-semibold text-foreground leading-snug">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {optionKeys.map((key) => {
                const state = optionState(key);
                return (
                  <motion.button
                    key={key}
                    type="button"
                    disabled={isChecked}
                    onClick={() => handleSelectOption(key)}
                    whileTap={!isChecked ? { scale: 0.985 } : {}}
                    transition={{ duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border px-4 py-3 text-left",
                      "transition-colors duration-150 cursor-pointer",
                      "disabled:cursor-default",
                      // Idle
                      state === "idle" &&
                        "border-border bg-card hover:border-primary/40 hover:bg-primary/5",
                      // Selected (not yet checked)
                      state === "selected" &&
                        "border-primary bg-primary/8",
                      // Correct answer revealed
                      state === "correct" &&
                        "border-[var(--success)]/50 bg-[var(--success)]/10",
                      // Wrong selected answer
                      state === "wrong" &&
                        "border-[var(--error)]/50 bg-[var(--error)]/10"
                    )}
                  >
                    {/* Key badge */}
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                        "font-mono text-xs font-bold transition-colors duration-150",
                        state === "idle" &&
                          "bg-secondary text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary",
                        state === "selected" &&
                          "bg-primary text-primary-foreground",
                        state === "correct" &&
                          "bg-[var(--success)] text-white",
                        state === "wrong" &&
                          "bg-[var(--error)] text-white"
                      )}
                    >
                      {key}
                    </span>

                    {/* Option text */}
                    <span
                      className={cn(
                        "flex-1 text-sm leading-snug transition-colors duration-150",
                        state === "idle" && "text-foreground",
                        state === "selected" && "text-foreground font-medium",
                        state === "correct" && "text-[var(--success)] font-medium",
                        state === "wrong" && "text-[var(--error)]"
                      )}
                    >
                      {currentQuestion.options[key]}
                    </span>

                    {/* Feedback icon */}
                    <AnimatePresence>
                      {state === "correct" && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="shrink-0 text-[var(--success)]"
                        >
                          <IconCheck />
                        </motion.span>
                      )}
                      {state === "wrong" && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="shrink-0 text-[var(--error)]"
                        >
                          <IconX />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation (revealed after check) */}
            <AnimatePresence>
              {isChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Explanation: </span>
                    {currentQuestion.explanation}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {/* Check Answer button */}
        <AnimatePresence>
          {!isChecked && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <button
                type="button"
                onClick={() => void handleCheck()}
                disabled={!selectedAnswer || isSubmitting}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150",
                  selectedAnswer && !isSubmitting
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
                )}
              >
                {isSubmitting ? "Submitting…" : "Check Answer"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button (hidden on last question) */}
        <AnimatePresence>
          {isChecked && !isLastQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity duration-150"
              >
                Next
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
