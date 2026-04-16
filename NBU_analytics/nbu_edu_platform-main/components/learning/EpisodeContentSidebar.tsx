"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { InteractiveQuiz } from "./InteractiveQuiz";
import { InteractiveFlashcards } from "./InteractiveFlashcards";
import { InteractiveMindMap } from "./InteractiveMindMap";
import type { QuizQuestion, Flashcard, MindMapNode } from "@/lib/course-content/types";
import type { QuizLabels, FlashcardLabels, MindMapLabels } from "@/lib/course-content/ui-copy";

type ContentTab = "quiz" | "flashcards" | "mental_map" | "test";

interface TabLabels {
  quiz: string;
  flashcards: string;
  mentalMap: string;
  test: string;
}

export interface EpisodeContentSidebarProps {
  quiz: { questions: QuizQuestion[] };
  flashcards: { cards: Flashcard[] };
  mentalMap: { root: MindMapNode };
  test: { questions: QuizQuestion[] };
  tabLabels: TabLabels;
  quizLabels: QuizLabels;
  flashcardLabels: FlashcardLabels;
  mindMapLabels: MindMapLabels;
  className?: string;
}

function IconQuestion() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-3a1 1 0 0 0-.867.5 1 1 0 1 1-1.731-1A3 3 0 0 1 13 10a3 3 0 0 1-2 2.83V13a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1 1 1 0 1 0 0-2H9a1 1 0 0 1-1-1zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconCards() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M7 3a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7zM4 7a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM2 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4z" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2h-3v1a1 1 0 0 1-2 0V7H6a1 1 0 0 1 0-2h3V4a1 1 0 0 1 1-1zM3 12a1 1 0 0 1 1-1h3v-1a1 1 0 1 1 2 0v1h3a1 1 0 1 1 0 2h-3v1a1 1 0 1 1-2 0v-1H4a1 1 0 0 1-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H8zm-2 0a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2z" />
    </svg>
  );
}

export function EpisodeContentSidebar({
  quiz,
  flashcards,
  mentalMap,
  test,
  tabLabels,
  quizLabels,
  flashcardLabels,
  mindMapLabels,
  className,
}: EpisodeContentSidebarProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("quiz");

  const tabs: { id: ContentTab; label: string; icon: React.ReactNode }[] = [
    { id: "quiz", label: tabLabels.quiz, icon: <IconQuestion /> },
    { id: "flashcards", label: tabLabels.flashcards, icon: <IconCards /> },
    { id: "mental_map", label: tabLabels.mentalMap, icon: <IconBranch /> },
    { id: "test", label: tabLabels.test, icon: <IconClipboard /> },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden",
        className,
      )}
    >
      {/* Tab bar */}
      <div
        className="relative flex border-b border-border shrink-0"
        role="tablist"
        aria-label="Learning content tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium",
                "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-inset",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="episode-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4" role="tabpanel">
        {activeTab === "quiz" && (
          <InteractiveQuiz questions={quiz.questions} labels={quizLabels} />
        )}
        {activeTab === "flashcards" && (
          <InteractiveFlashcards cards={flashcards.cards} labels={flashcardLabels} />
        )}
        {activeTab === "mental_map" && (
          <InteractiveMindMap root={mentalMap.root} labels={mindMapLabels} />
        )}
        {activeTab === "test" && (
          <InteractiveQuiz questions={test.questions} labels={quizLabels} />
        )}
      </div>
    </div>
  );
}
