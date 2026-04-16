
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/react-edu/lib/utils";
import type { QuizLabels } from "@/react-edu/lib/course-content/ui-copy";

interface QuizAnswerOption {
  text: string;
  isCorrect: boolean;
  rationale: string;
}

interface QuizQuestion {
  question: string;
  answerOptions: QuizAnswerOption[];
  hint?: string;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  labels: QuizLabels;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
    </svg>
  );
}

export function InteractiveQuiz({ questions, labels }: InteractiveQuizProps) {
  const total = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [direction, setDirection] = useState(1);

  const q = questions[currentIndex];

  function handleSelect(idx: number) {
    if (checked) return;
    setSelectedIndex(idx);
  }

  function handleCheck() {
    if (selectedIndex === null || checked) return;
    setChecked(true);
    if (q.answerOptions[selectedIndex].isCorrect) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setChecked(false);
    } else {
      setShowResults(true);
    }
  }

  function handleRetry() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setChecked(false);
    setScore(0);
    setShowResults(false);
    setDirection(1);
  }

  const progressPercent = ((currentIndex + (checked ? 1 : 0)) / total) * 100;

  if (showResults) {
    const percent = Math.round((score / total) * 100);
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col items-center gap-6 py-8"
      >
        <div className="relative inline-flex items-center justify-center">
          <svg width="136" height="136" viewBox="0 0 136 136" fill="none" className="rotate-[-90deg]">
            <circle cx="68" cy="68" r={radius} stroke="currentColor" strokeWidth="10" className="text-border" />
            <motion.circle
              cx="68" cy="68" r={radius} stroke="currentColor" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              className={percent >= 60 ? "text-[var(--success)]" : "text-[var(--error)]"}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-3xl font-bold text-foreground">{score}/{total}</span>
            <span className="font-mono text-xs text-muted-foreground">{labels.scoreLabel}</span>
          </div>
        </div>
        <p className="font-heading text-xl font-bold text-foreground">
          {percent >= 85 ? labels.resultExcellent : percent >= 60 ? labels.resultGood : labels.resultKeepPracticing}
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {labels.retryQuiz}
        </button>
      </motion.div>
    );
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground shrink-0">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Question card */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: EASE }}
            className="rounded-xl border border-border bg-card shadow-sm p-5 flex flex-col gap-4"
          >
            <span className="font-mono text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 self-start">
              {labels.questionOf} {currentIndex + 1} {labels.ofTotal} {total}
            </span>

            <p className="font-heading text-lg font-semibold text-foreground leading-snug">
              {q.question}
            </p>

            <div className="flex flex-col gap-2.5">
              {q.answerOptions.map((opt, idx) => {
                const isSelected = selectedIndex === idx;
                const isCorrect = checked && opt.isCorrect;
                const isWrong = checked && isSelected && !opt.isCorrect;

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={checked}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-150",
                      !checked && !isSelected && "border-border bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
                      !checked && isSelected && "border-primary bg-primary/8 cursor-pointer",
                      isCorrect && "border-[var(--success)]/50 bg-[var(--success)]/10",
                      isWrong && "border-[var(--error)]/50 bg-[var(--error)]/10",
                      checked && !isCorrect && !isWrong && "border-border bg-card opacity-60",
                    )}
                  >
                    <span className={cn(
                      "flex-1 text-sm leading-snug",
                      isCorrect && "text-[var(--success)] font-medium",
                      isWrong && "text-[var(--error)]",
                      !isCorrect && !isWrong && "text-foreground",
                    )}>
                      {opt.text}
                    </span>
                    {isCorrect && <span className="text-[var(--success)]"><IconCheck /></span>}
                    {isWrong && <span className="text-[var(--error)]"><IconX /></span>}
                  </button>
                );
              })}
            </div>

            {/* Rationale after check */}
            <AnimatePresence>
              {checked && selectedIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">{labels.explanation} </span>
                    {q.answerOptions.find((o) => o.isCorrect)?.rationale ?? q.answerOptions[selectedIndex].rationale}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!checked && (
          <button
            type="button"
            onClick={handleCheck}
            disabled={selectedIndex === null}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150",
              selectedIndex !== null
                ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
            )}
          >
            {labels.checkAnswer}
          </button>
        )}
        {checked && (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            {currentIndex < total - 1 ? labels.next : labels.seeResults}
          </button>
        )}
      </div>
    </div>
  );
}
