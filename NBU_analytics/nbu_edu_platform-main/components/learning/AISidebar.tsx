"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuizView } from "./QuizView";
import { FlashcardDeck } from "./FlashcardDeck";
import { MentalMap } from "./MentalMap";
import { TestView } from "./TestView";

// ── Types ────────────────────────────────────────────────────────────────────

type ContentTab = "quiz" | "flashcards" | "mental_map" | "test";

interface AISidebarProps {
  videoId: string;
  className?: string;
}

// ── Content type definitions (mirroring the child component props) ────────────

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

interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
}

interface FlashcardContent {
  cards: Flashcard[];
}

interface MentalMapNode {
  id: string;
  label: string;
  relationship?: string;
  is_key_takeaway?: boolean;
  children: MentalMapNode[];
}

interface MentalMapContent {
  root: MentalMapNode;
}

interface TestQuestion {
  id: string;
  type: "mcq" | "true_false";
  question: string;
  options?: Record<string, string>;
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

// Discriminated union for cached tab content
type TabCacheEntry =
  | { tab: "quiz"; content: QuizContent; contentId: string }
  | { tab: "flashcards"; content: FlashcardContent; contentId: string }
  | { tab: "mental_map"; content: MentalMapContent; contentId: string }
  | { tab: "test"; content: TestContent; contentId: string };

// null = fetched but no content (404), undefined = never fetched
type ContentCache = Partial<Record<ContentTab, TabCacheEntry | null>>;

// API response shape from /api/videos/:videoId/content/:tab
interface LearningContentResponse {
  id: string;
  videoId: string;
  contentType: string;
  content: unknown;
}

// ── Tab Config ────────────────────────────────────────────────────────────────

interface TabConfig {
  id: ContentTab;
  label: string;
  icon: React.ReactNode;
}

function IconQuestion() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M7 3a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7zM4 7a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zM2 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4z" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1H8zm-2 0a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2z" />
    </svg>
  );
}

const TABS: TabConfig[] = [
  { id: "quiz", label: "Quiz", icon: <IconQuestion /> },
  { id: "flashcards", label: "Cards", icon: <IconCards /> },
  { id: "mental_map", label: "Map", icon: <IconBranch /> },
  { id: "test", label: "Test", icon: <IconClipboard /> },
];

// ── Skeleton Loader ───────────────────────────────────────────────────────────

function SkeletonLoader() {
  return (
    <div className="space-y-4 p-4" aria-label="Loading content…">
      <div className="h-6 w-3/4 rounded bg-secondary animate-pulse" />
      <div className="h-4 w-full rounded bg-secondary animate-pulse" />
      <div className="h-4 w-5/6 rounded bg-secondary animate-pulse" />
      <div className="h-32 w-full rounded bg-secondary animate-pulse" />
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: ContentTab }) {
  const labels: Record<ContentTab, string> = {
    quiz: "quiz",
    flashcards: "flashcards",
    mental_map: "mental map",
    test: "test",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">
        No {labels[tab]} content available for this video.
      </p>
    </div>
  );
}

// ── Type guards for API response content ──────────────────────────────────────

function isQuizContent(value: unknown): value is QuizContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "questions" in value &&
    Array.isArray((value as Record<string, unknown>).questions)
  );
}

function isFlashcardContent(value: unknown): value is FlashcardContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "cards" in value &&
    Array.isArray((value as Record<string, unknown>).cards)
  );
}

function isMentalMapContent(value: unknown): value is MentalMapContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "root" in value &&
    typeof (value as Record<string, unknown>).root === "object"
  );
}

function isTestContent(value: unknown): value is TestContent {
  return (
    typeof value === "object" &&
    value !== null &&
    "questions" in value &&
    "test_title" in value
  );
}

// ── Tab Content Renderer ──────────────────────────────────────────────────────

interface TabContentProps {
  entry: TabCacheEntry;
}

function TabContent({ entry }: TabContentProps) {
  if (entry.tab === "quiz") {
    return (
      <QuizView
        content={entry.content}
        onSubmit={async (answers) => {
          const res = await fetch("/api/progress/quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content_id: entry.contentId, answers }),
          });
          return res.json() as Promise<{
            score_percent: number;
            corrections: Record<
              string,
              { selected: string; correct: string; isCorrect: boolean }
            >;
          }>;
        }}
      />
    );
  }

  if (entry.tab === "flashcards") {
    return (
      <FlashcardDeck
        content={entry.content}
        onRate={(cardId, rating) => {
          void fetch("/api/progress/flashcard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content_id: entry.contentId,
              card_id: cardId,
              rating,
            }),
          });
        }}
      />
    );
  }

  if (entry.tab === "mental_map") {
    return <MentalMap content={entry.content} />;
  }

  // tab === "test"
  return (
    <TestView
      content={entry.content}
      onSubmit={async (answers) => {
        const res = await fetch("/api/progress/test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content_id: entry.contentId, answers }),
        });
        return res.json() as Promise<{
          score_percent: number;
          passed: boolean;
          total_points: number;
          earned_points: number;
          corrections: Record<
            string,
            {
              selected: string;
              correct: string;
              isCorrect: boolean;
              points: number;
              earnedPoints: number;
            }
          >;
        }>;
      }}
    />
  );
}

// ── Initial loader — triggers a fetch on mount for the default tab ─────────────

interface InitialLoaderProps {
  onMount: () => void;
}

function InitialLoader({ onMount }: InitialLoaderProps) {
  useEffect(() => {
    onMount();
    // intentionally only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <SkeletonLoader />;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AISidebar({ videoId, className }: AISidebarProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("quiz");
  const [contentCache, setContentCache] = useState<ContentCache>({});
  const [loadingTab, setLoadingTab] = useState<ContentTab | null>(null);
  const [errorTab, setErrorTab] = useState<ContentTab | null>(null);

  const fetchTabContent = useCallback(
    async (tab: ContentTab) => {
      // Already cached (including explicit null / "no content") — skip
      if (tab in contentCache) return;

      setLoadingTab(tab);
      setErrorTab(null);

      try {
        const res = await fetch(`/api/videos/${videoId}/content/${tab}`);

        if (res.status === 404) {
          // Store null as a sentinel so we don't refetch
          setContentCache((prev) => ({ ...prev, [tab]: null }));
          return;
        }

        if (!res.ok) {
          setErrorTab(tab);
          return;
        }

        const data = (await res.json()) as LearningContentResponse;
        const rawContent = data.content;
        const id = data.id;

        let entry: TabCacheEntry | null = null;

        if (tab === "quiz" && isQuizContent(rawContent)) {
          entry = { tab: "quiz", content: rawContent, contentId: id };
        } else if (tab === "flashcards" && isFlashcardContent(rawContent)) {
          entry = { tab: "flashcards", content: rawContent, contentId: id };
        } else if (tab === "mental_map" && isMentalMapContent(rawContent)) {
          entry = { tab: "mental_map", content: rawContent, contentId: id };
        } else if (tab === "test" && isTestContent(rawContent)) {
          entry = { tab: "test", content: rawContent, contentId: id };
        }

        if (entry !== null) {
          setContentCache((prev) => ({ ...prev, [tab]: entry }));
        } else {
          // Content shape didn't match — treat as unavailable
          setContentCache((prev) => ({ ...prev, [tab]: null }));
        }
      } catch {
        setErrorTab(tab);
      } finally {
        setLoadingTab(null);
      }
    },
    [videoId, contentCache]
  );

  function handleTabSelect(tab: ContentTab) {
    setActiveTab(tab);
    void fetchTabContent(tab);
  }

  // Derived state for the active tab
  const currentEntry = contentCache[activeTab]; // TabCacheEntry | null | undefined
  const isLoading = loadingTab === activeTab;
  // undefined = never fetched; null = fetched but no content
  const neverFetched = !(activeTab in contentCache) && !isLoading;
  const isNoContent = currentEntry === null && !isLoading;
  const hasNetworkError = errorTab === activeTab && !(activeTab in contentCache);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden",
        className
      )}
    >
      {/* Tab bar */}
      <div
        className="relative flex border-b border-border shrink-0"
        role="tablist"
        aria-label="Learning content tabs"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabSelect(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs font-medium",
                "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-inset",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>

              {/* Sliding underline indicator */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                  transition={{
                    duration: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content area */}
      <div className="flex-1 overflow-y-auto" role="tabpanel">
        {isLoading ? (
          <SkeletonLoader />
        ) : isNoContent || hasNetworkError ? (
          <EmptyState tab={activeTab} />
        ) : neverFetched ? (
          // Default tab hasn't been fetched yet — mount triggers the fetch
          <InitialLoader onMount={() => void fetchTabContent(activeTab)} />
        ) : currentEntry !== undefined && currentEntry !== null ? (
          <div className="p-4">
            <TabContent entry={currentEntry} />
          </div>
        ) : (
          <SkeletonLoader />
        )}
      </div>
    </div>
  );
}
