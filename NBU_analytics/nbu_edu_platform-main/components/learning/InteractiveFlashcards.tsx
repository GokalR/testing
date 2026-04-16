"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FlashcardLabels } from "@/lib/course-content/ui-copy";

interface Flashcard {
  front: string;
  back: string;
}

interface InteractiveFlashcardsProps {
  cards: Flashcard[];
  labels: FlashcardLabels;
}

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const FLIP_EASE = [0.4, 0.0, 0.2, 1.0] as const;

export function InteractiveFlashcards({ cards, labels }: InteractiveFlashcardsProps) {
  const total = cards.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const card = cards[currentIndex];

  const handleFlip = useCallback(() => {
    if (isAdvancing) return;
    setIsFlipped((f) => !f);
  }, [isAdvancing]);

  const handleNext = useCallback(() => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    setReviewed((r) => r + 1);

    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setCurrentIndex(0);
      }
      setIsAdvancing(false);
    }, 300);
  }, [isAdvancing, currentIndex, total]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(0);
    setIsAdvancing(false);
  }, []);

  const progressPercent = total > 0 ? Math.min((reviewed / total) * 100, 100) : 0;
  const allReviewed = reviewed >= total;

  if (allReviewed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col items-center gap-6 py-8"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-heading text-xl font-bold text-foreground">{labels.reviewComplete}</p>
          <p className="mt-1 text-sm text-muted-foreground">{total} {labels.cardsReviewed}</p>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {labels.restartDeck}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground shrink-0">
          {Math.min(reviewed + 1, total)}/{total}
        </span>
      </div>

      {/* Card with 3D flip */}
      <div className="relative mx-auto w-full max-w-md" style={{ perspective: "1000px" }}>
        {currentIndex < total - 1 && (
          <div className="absolute inset-x-2 top-2 h-full rounded-xl border border-border bg-card/50 shadow-sm -z-10" />
        )}
        {currentIndex < total - 2 && (
          <div className="absolute inset-x-4 top-4 h-full rounded-xl border border-border bg-card/30 shadow-sm -z-20" />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: FLIP_EASE }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={handleFlip}
              className="relative min-h-[240px] cursor-pointer"
            >
              {/* Front face */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{labels.front}</span>
                <p className="text-center font-heading text-lg font-semibold text-foreground leading-snug">
                  {card.front}
                </p>
                <span className="mt-4 text-xs text-muted-foreground">{labels.clickToFlip}</span>
              </div>

              {/* Back face */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <span className="mb-3 font-mono text-[10px] uppercase tracking-widest text-primary">{labels.back}</span>
                <p className="text-center text-sm leading-relaxed text-foreground">
                  {card.back}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating buttons */}
      <AnimatePresence>
        {isFlipped && !isAdvancing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex justify-center gap-3"
          >
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-[var(--error)]/30 px-4 py-2 text-sm font-medium text-[var(--error)] hover:bg-[var(--error)]/5 transition-colors"
            >
              {labels.again}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-yellow-500/30 px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-500/5 transition-colors"
            >
              {labels.hard}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-[var(--success)]/30 px-4 py-2 text-sm font-medium text-[var(--success)] hover:bg-[var(--success)]/5 transition-colors"
            >
              {labels.good}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-500/5 transition-colors"
            >
              {labels.easy}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
