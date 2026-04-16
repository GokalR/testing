
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/react-edu/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface TestQuestion {
  id: string;
  type: "mcq" | "true_false";
  question: string;
  options?: Record<string, string>; // for MCQ
  correct_answer: string;
  points: number;
  difficulty: string;
}

interface TestContent {
  test_title: string;
  time_limit_minutes: number;
  passing_score_percent: number;
  questions: TestQuestion[];
}

interface TestCorrection {
  selected: string;
  correct: string;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
}

interface TestResult {
  score_percent: number;
  passed: boolean;
  total_points: number;
  earned_points: number;
  corrections: Record<string, TestCorrection>;
}

interface TestViewProps {
  content: TestContent;
  onSubmit: (answers: Record<string, string>) => Promise<TestResult>;
}

// ── Constants ────────────────────────────────────────────────────────────────

const EASE_STANDARD = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SPRING = [0.34, 1.56, 0.64, 1.0] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function difficultyColor(difficulty: string): string {
  const d = difficulty.toLowerCase();
  if (d === "easy")
    return "text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/30";
  if (d === "hard")
    return "text-[var(--error)] bg-[var(--error)]/10 border-[var(--error)]/30";
  return "text-muted-foreground bg-secondary border-border";
}

// ── SVG Icons ────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-12a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l2.5 2.5a1 1 0 0 0 1.414-1.414L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ── Timer Bar ────────────────────────────────────────────────────────────────

interface TimerBarProps {
  timeRemaining: number;
  totalSeconds: number;
}

function TimerBar({ timeRemaining, totalSeconds }: TimerBarProps) {
  const isUrgent = timeRemaining < 300; // < 5 minutes
  const progressPct = totalSeconds > 0 ? (timeRemaining / totalSeconds) * 100 : 0;

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5 border-b border-border transition-colors duration-500",
        isUrgent
          ? "bg-[var(--error)]/10 border-[var(--error)]/30"
          : "bg-background/95 backdrop-blur-sm"
      )}
    >
      <span
        className={cn(
          "shrink-0 transition-colors duration-500",
          isUrgent ? "text-[var(--error)]" : "text-muted-foreground"
        )}
      >
        <IconClock />
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-500",
            isUrgent ? "bg-[var(--error)]" : "bg-primary"
          )}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </div>
      <span
        className={cn(
          "font-mono text-sm font-semibold tabular-nums shrink-0 transition-colors duration-500",
          isUrgent ? "text-[var(--error)]" : "text-foreground"
        )}
      >
        {formatTime(timeRemaining)} remaining
      </span>
    </div>
  );
}

// ── MCQ Option Card ──────────────────────────────────────────────────────────

interface McqOptionProps {
  optionKey: string;
  text: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (key: string) => void;
}

function McqOption({
  optionKey,
  text,
  isSelected,
  isDisabled,
  onSelect,
}: McqOptionProps) {
  return (
    <label
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer",
        "transition-colors duration-150",
        isDisabled && "cursor-not-allowed opacity-60",
        !isDisabled && !isSelected && "border-border bg-card hover:border-primary/40 hover:bg-primary/5",
        isSelected && "border-primary bg-primary/8"
      )}
    >
      <input
        type="radio"
        className="sr-only"
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => {
          if (!isDisabled) onSelect(optionKey);
        }}
      />
      {/* Key badge */}
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          "font-mono text-xs font-bold transition-colors duration-150",
          !isSelected &&
            "bg-secondary text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary",
          isSelected && "bg-primary text-primary-foreground"
        )}
      >
        {optionKey}
      </span>
      {/* Option text */}
      <span
        className={cn(
          "flex-1 text-sm leading-snug transition-colors duration-150",
          !isSelected && "text-foreground",
          isSelected && "text-foreground font-medium"
        )}
      >
        {text}
      </span>
    </label>
  );
}

// ── True/False Toggle ────────────────────────────────────────────────────────

interface TrueFalseToggleProps {
  selected: string | undefined;
  isDisabled: boolean;
  onSelect: (value: string) => void;
}

function TrueFalseToggle({
  selected,
  isDisabled,
  onSelect,
}: TrueFalseToggleProps) {
  const options: Array<{ value: string; label: string }> = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  return (
    <div className="flex gap-3">
      {options.map(({ value, label }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) onSelect(value);
            }}
            className={cn(
              "flex-1 rounded-xl border px-6 py-3 text-sm font-semibold",
              "transition-all duration-150",
              isDisabled && "cursor-not-allowed opacity-60",
              !isSelected &&
                !isDisabled &&
                "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              !isSelected && isDisabled && "border-border bg-card text-foreground",
              isSelected && "border-primary bg-primary text-primary-foreground"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Question Card ────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: TestQuestion;
  index: number;
  selectedAnswer: string | undefined;
  isSubmitted: boolean;
  correction: TestCorrection | undefined;
  onAnswer: (questionId: string, answer: string) => void;
}

function QuestionCard({
  question,
  index,
  selectedAnswer,
  isSubmitted,
  correction,
  onAnswer,
}: QuestionCardProps) {
  const optionKeys = question.options
    ? Object.keys(question.options).sort()
    : [];

  const isCorrect = correction?.isCorrect;
  const correctAnswer = correction?.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: EASE_STANDARD,
      }}
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col gap-4",
        isSubmitted && isCorrect === true && "border-[var(--success)]/40",
        isSubmitted && isCorrect === false && "border-[var(--error)]/40"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Question number */}
          <span className="font-mono text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5">
            Q{index + 1}
          </span>
          {/* Points badge */}
          <span className="font-mono text-xs text-muted-foreground bg-secondary border border-border rounded-md px-2 py-0.5">
            {question.points} {question.points === 1 ? "pt" : "pts"}
          </span>
        </div>
        {/* Difficulty badge */}
        <span
          className={cn(
            "shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
            difficultyColor(question.difficulty)
          )}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Question text */}
      <p className="font-heading text-base font-semibold text-foreground leading-snug">
        {question.question}
      </p>

      {/* Answer input */}
      {question.type === "mcq" && question.options ? (
        <div className="flex flex-col gap-2">
          {optionKeys.map((key) => (
            <McqOption
              key={key}
              optionKey={key}
              text={question.options![key]}
              isSelected={selectedAnswer === key}
              isDisabled={isSubmitted}
              onSelect={(k) => onAnswer(question.id, k)}
            />
          ))}
        </div>
      ) : (
        <TrueFalseToggle
          selected={selectedAnswer}
          isDisabled={isSubmitted}
          onSelect={(v) => onAnswer(question.id, v)}
        />
      )}

      {/* Result feedback (shown after submit) */}
      <AnimatePresence>
        {isSubmitted && correction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE_STANDARD }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 text-sm",
                isCorrect
                  ? "border-[var(--success)]/30 bg-[var(--success)]/5"
                  : "border-[var(--error)]/30 bg-[var(--error)]/5"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  isCorrect
                    ? "bg-[var(--success)]/20 text-[var(--success)]"
                    : "bg-[var(--error)]/20 text-[var(--error)]"
                )}
              >
                {isCorrect ? <IconCheck /> : <IconX />}
              </span>
              <div className="min-w-0 flex-1 space-y-0.5">
                {isCorrect ? (
                  <p className="font-medium text-[var(--success)]">
                    Correct! +{correction.earnedPoints}{" "}
                    {correction.earnedPoints === 1 ? "point" : "points"}
                  </p>
                ) : (
                  <>
                    <p className="font-medium text-[var(--error)]">Incorrect</p>
                    <p className="text-xs text-muted-foreground">
                      Your answer:{" "}
                      <span className="font-mono text-[var(--error)]">
                        {correction.selected}
                      </span>{" "}
                      &mdash; Correct:{" "}
                      <span className="font-mono text-[var(--success)]">
                        {correctAnswer}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Score Bar ────────────────────────────────────────────────────────────────

interface ScoreBarProps {
  percent: number;
  passed: boolean;
}

function ScoreBar({ percent, passed }: ScoreBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">Score</span>
        <span
          className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            passed ? "text-[var(--success)]" : "text-[var(--error)]"
          )}
        >
          {Math.round(percent)}%
        </span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            passed ? "bg-[var(--success)]" : "bg-[var(--error)]"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: EASE_STANDARD }}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function TestView({ content, onSubmit }: TestViewProps) {
  const { questions, time_limit_minutes, passing_score_percent, test_title } =
    content;
  const totalSeconds = time_limit_minutes * 60;

  // ── State ────────────────────────────────────────────────────────────────────

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoSubmittedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const allAnswered = answeredCount === totalCount;

  // ── Submit handler ───────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (isAuto = false) => {
      if (isSubmitted || isSubmitting) return;

      if (!isAuto) {
        const confirmed = window.confirm(
          "Are you sure you want to submit the test? You cannot change your answers after submitting."
        );
        if (!confirmed) return;
      }

      // Stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsSubmitting(true);
      try {
        const testResult = await onSubmit(answers);
        setResult(testResult);
        setIsSubmitted(true);
        // Scroll to top to show results
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, isSubmitted, isSubmitting, onSubmit]
  );

  // ── Timer effect ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isSubmitted) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit once
          if (!hasAutoSubmittedRef.current) {
            hasAutoSubmittedRef.current = true;
            // Fire async without awaiting inside setState
            void handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  // ── Answer handler ───────────────────────────────────────────────────────────

  function handleAnswer(questionId: string, answer: string) {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }

  // ── Retake ───────────────────────────────────────────────────────────────────

  function handleRetake() {
    hasAutoSubmittedRef.current = false;
    setAnswers({});
    setTimeRemaining(totalSeconds);
    setIsSubmitted(false);
    setResult(null);
    setIsSubmitting(false);
  }

  // ── Results Screen ───────────────────────────────────────────────────────────

  if (isSubmitted && result) {
    return (
      <div ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="flex flex-col gap-8 py-6 px-4"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {test_title}
            </h2>
            <p className="text-sm text-muted-foreground">Test Complete</p>
          </div>

          {/* Pass/Fail badge + score */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE_SPRING }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider",
                result.passed
                  ? "bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30"
                  : "bg-[var(--error)]/15 text-[var(--error)] border border-[var(--error)]/30"
              )}
            >
              {result.passed ? <IconCheck /> : <IconX />}
              {result.passed ? "PASSED" : "FAILED"}
            </motion.div>

            {/* Score fraction */}
            <p className="font-mono text-3xl font-bold text-foreground tabular-nums">
              {result.earned_points}
              <span className="text-muted-foreground text-xl font-normal">
                /{result.total_points}
              </span>
              <span className="ml-2 text-base font-normal text-muted-foreground">
                points
              </span>
            </p>
          </div>

          {/* Score bar */}
          <div className="max-w-md w-full mx-auto">
            <ScoreBar percent={result.score_percent} passed={result.passed} />
            <p className="mt-2 text-xs text-center text-muted-foreground">
              Passing threshold:{" "}
              <span className="font-mono font-semibold text-foreground">
                {passing_score_percent}%
              </span>
            </p>
          </div>

          {/* Question-by-question review */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Review
            </h3>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                selectedAnswer={answers[q.id]}
                isSubmitted={true}
                correction={result.corrections[q.id]}
                onAnswer={handleAnswer}
              />
            ))}
          </div>

          {/* Retake button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleRetake}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-6 py-2.5",
                "bg-primary text-primary-foreground font-medium text-sm",
                "hover:opacity-90 transition-opacity duration-150"
              )}
            >
              <IconRefresh />
              Retake Test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Test Screen ──────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Sticky timer bar */}
      <TimerBar timeRemaining={timeRemaining} totalSeconds={totalSeconds} />

      {/* Test header */}
      <div className="px-4 pt-5 pb-3 border-b border-border">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {test_title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "question" : "questions"} &middot;{" "}
          {time_limit_minutes} min &middot; Pass at {passing_score_percent}%
        </p>
        {/* Answer progress */}
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {answeredCount}/{totalCount} answered
          </span>
          <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${(answeredCount / totalCount) * 100}%` }}
              transition={{ duration: 0.3, ease: EASE_STANDARD }}
            />
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-4 p-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            selectedAnswer={answers[q.id]}
            isSubmitted={false}
            correction={undefined}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* Submit button */}
      <div className="sticky bottom-0 px-4 pb-4 pt-3 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-between gap-4">
          <p
            className={cn(
              "text-xs font-mono transition-colors duration-200",
              allAnswered ? "text-[var(--success)]" : "text-muted-foreground"
            )}
          >
            {allAnswered
              ? "All questions answered"
              : `${totalCount - answeredCount} unanswered`}
          </p>
          <button
            type="button"
            disabled={!allAnswered || isSubmitting}
            onClick={() => void handleSubmit(false)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium",
              "transition-all duration-150",
              allAnswered && !isSubmitting
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
            )}
          >
            {isSubmitting ? "Submitting…" : "Submit Test"}
          </button>
        </div>
      </div>
    </div>
  );
}
