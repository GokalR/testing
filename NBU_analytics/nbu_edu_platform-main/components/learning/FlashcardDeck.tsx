"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

interface FlashcardContent {
  cards: Flashcard[];
}

interface FlashcardDeckProps {
  content: FlashcardContent;
  onRate: (cardId: string, rating: number) => void;
}

const EASE_STANDARD = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_FLIP = [0.4, 0.0, 0.2, 1.0] as const;

// Rating button configs — using semantic Tailwind classes only
const RATING_BUTTONS = [
  {
    rating: 1,
    label: "Again",
    className:
      "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
  },
  {
    rating: 2,
    label: "Hard",
    className:
      "border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white dark:text-orange-400 dark:hover:text-white",
  },
  {
    rating: 3,
    label: "Good",
    className:
      "border border-green-600 text-green-700 hover:bg-green-600 hover:text-white dark:text-green-400 dark:hover:text-white",
  },
  {
    rating: 4,
    label: "Easy",
    className:
      "border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:text-blue-400 dark:hover:text-white",
  },
] as const;

export function FlashcardDeck({ content, onRate }: FlashcardDeckProps) {
  const { cards } = content;
  const total = cards.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isComplete, setIsComplete] = useState(false);

  const reviewed = Object.keys(ratings).length;
  const progressPct = total > 0 ? (reviewed / total) * 100 : 0;

  const currentCard = cards[currentIndex] ?? null;

  const handleFlip = useCallback(() => {
    if (isAdvancing) return;
    setIsFlipped((v) => !v);
  }, [isAdvancing]);

  const handleRate = useCallback(
    (rating: number) => {
      if (!currentCard || isAdvancing) return;

      setRatings((prev) => ({ ...prev, [currentCard.id]: rating }));
      onRate(currentCard.id, rating);

      setIsAdvancing(true);

      // Brief delay so card can flip back before sliding
      setTimeout(() => {
        setIsFlipped(false);
        setTimeout(() => {
          setSlideDirection(1);
          if (currentIndex + 1 >= total) {
            setIsComplete(true);
          } else {
            setCurrentIndex((i) => i + 1);
          }
          setIsAdvancing(false);
        }, 200);
      }, 100);
    },
    [currentCard, currentIndex, isAdvancing, onRate, total]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setRatings({});
    setIsAdvancing(false);
    setSlideDirection(1);
    setIsComplete(false);
  }, []);

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex flex-col items-center gap-8 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_STANDARD }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {/* Checkmark icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-primary"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Review Complete!
          </h2>
          <p className="text-muted-foreground text-base max-w-xs">
            You reviewed{" "}
            <span className="font-mono font-semibold text-foreground">
              {total}
            </span>{" "}
            {total === 1 ? "card" : "cards"} in this session.
          </p>

          {/* Rating summary */}
          <div className="flex gap-4 mt-2">
            {RATING_BUTTONS.map(({ rating, label }) => {
              const count = Object.values(ratings).filter(
                (r) => r === rating
              ).length;
              return (
                <div key={rating} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-lg font-semibold text-foreground">
                    {count}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <button
          type="button"
          onClick={handleRestart}
          className={cn(
            "px-6 py-2.5 rounded-lg font-semibold text-sm",
            "bg-primary text-primary-foreground",
            "hover:opacity-90 active:opacity-80 transition-opacity duration-150"
          )}
        >
          Restart Deck
        </button>
      </div>
    );
  }

  if (!currentCard) return null;

  // Stack peek cards (next 2 behind the current)
  const peekCards = [cards[currentIndex + 1], cards[currentIndex + 2]].filter(
    Boolean
  );

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 select-none">
      {/* Progress bar */}
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground font-mono">
            {reviewed}/{total} reviewed
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.35, ease: EASE_STANDARD }}
          />
        </div>
      </div>

      {/* Card stack + card */}
      <div className="relative w-full max-w-lg" style={{ height: "340px" }}>
        {/* Peek cards behind */}
        {peekCards
          .slice()
          .reverse()
          .map((card, i) => {
            const depth = peekCards.length - 1 - i;
            const offset = (depth + 1) * 8;
            const scale = 1 - (depth + 1) * 0.04;
            const opacity = 1 - (depth + 1) * 0.2;
            return (
              <div
                key={card.id}
                className="absolute inset-x-0 rounded-xl border border-border bg-card shadow-sm"
                style={{
                  top: `${-offset}px`,
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: depth,
                  height: "100%",
                }}
              />
            );
          })}

        {/* Current card — animated slide between cards */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentCard.id}
            initial={{ x: slideDirection * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: slideDirection * -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_STANDARD }}
            className="absolute inset-0"
            style={{ zIndex: 10 }}
          >
            {/* 3D flip container */}
            <div
              className="w-full h-full cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={handleFlip}
              role="button"
              tabIndex={0}
              aria-label={isFlipped ? "Card back — click to flip" : "Card front — click to flip"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleFlip();
                }
              }}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASE_FLIP,
                }}
              >
                {/* FRONT face */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col rounded-xl border border-border bg-card shadow-sm",
                    "px-8 py-6"
                  )}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
                      Front
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                      {currentCard.topic}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="font-heading text-xl text-foreground text-center leading-relaxed">
                      {currentCard.front}
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <span className="text-xs text-muted-foreground">
                      Click to reveal answer
                    </span>
                  </div>
                </div>

                {/* BACK face */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col rounded-xl border border-border bg-card shadow-sm",
                    "px-8 py-6"
                  )}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase">
                      Back
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                      {currentCard.topic}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-base text-foreground text-center leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <span className="text-xs text-muted-foreground">
                      How well did you know this?
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flip button (always visible) */}
      <button
        type="button"
        onClick={handleFlip}
        disabled={isAdvancing}
        className={cn(
          "px-5 py-2 rounded-lg text-sm font-medium border border-border",
          "text-foreground bg-background hover:bg-secondary",
          "transition-colors duration-150 disabled:opacity-50"
        )}
      >
        {isFlipped ? "Flip back" : "Flip"}
      </button>

      {/* Rating buttons — only visible when flipped */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: EASE_STANDARD }}
            className="flex gap-3 flex-wrap justify-center"
          >
            {RATING_BUTTONS.map(({ rating, label, className }) => (
              <button
                key={rating}
                type="button"
                disabled={isAdvancing}
                onClick={() => handleRate(rating)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold",
                  "transition-all duration-150 disabled:opacity-50",
                  className
                )}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card counter */}
      <p className="text-xs text-muted-foreground font-mono">
        Card {currentIndex + 1} of {total}
      </p>
    </div>
  );
}
