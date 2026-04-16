
import Link from "@/react-edu/adapters/router";
import { motion } from "framer-motion";
import { cn } from "@/react-edu/lib/utils";
import type { DashboardLabels } from "@/react-edu/lib/course-content/ui-copy";

interface DueCard {
  contentId: string;
  cardId: string;
  front: string;
  topic: string;
  videoTitle: string;
  courseTitle: string;
  courseId: string;
  videoId: string;
}

interface DueCardsProps {
  cards: DueCard[];
  labels: DashboardLabels;
}

const EASE_STANDARD = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: EASE_STANDARD,
    },
  },
};

/** Group cards by videoId, keeping insertion order. */
function groupByVideo(cards: DueCard[]): Map<string, DueCard[]> {
  const map = new Map<string, DueCard[]>();
  for (const card of cards) {
    const existing = map.get(card.videoId);
    if (existing) {
      existing.push(card);
    } else {
      map.set(card.videoId, [card]);
    }
  }
  return map;
}

export function DueCards({ cards, labels }: DueCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm p-8 text-center">
        <p className="text-muted-foreground font-medium">{labels.allCaughtUp}</p>
      </div>
    );
  }

  const grouped = groupByVideo(cards);
  const previewCards = cards.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <p className="text-sm font-medium text-foreground">
          <span className="font-mono font-bold text-lg text-foreground">{cards.length}</span>
          {" "}{labels.cardsDue}
        </p>
      </div>

      {/* Preview list */}
      <motion.ul
        className="divide-y divide-border"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {previewCards.map((card) => (
          <motion.li
            key={card.cardId}
            variants={cardVariants}
            className="flex items-start gap-3 px-5 py-3.5"
          >
            <span className="shrink-0 mt-0.5 px-2 py-0.5 rounded-md bg-secondary text-xs font-medium text-foreground border border-border">
              {card.topic}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2">{card.front}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {card.videoTitle} · {card.courseTitle}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {cards.length > 5 && (
        <p className="px-5 py-2 text-xs text-muted-foreground border-t border-border">
          {labels.andMore} {cards.length - 5}
        </p>
      )}

      {/* Per-video review links */}
      <div className={cn("px-5 py-4 border-t border-border", "flex flex-col gap-2")}>
        {Array.from(grouped.entries()).map(([videoId, groupCards]) => {
          const first = groupCards[0];
          return (
            <div key={videoId} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{first.videoTitle}</p>
                <p className="text-xs text-muted-foreground truncate">{first.courseTitle}</p>
              </div>
              <Link
                href={`/courses/${first.courseId}/learn/${videoId}`}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium",
                  "bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                )}
              >
                {labels.reviewCards} {groupCards.length}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
