import { cn } from "@/lib/utils";
import type { DashboardLabels } from "@/lib/course-content/ui-copy";

interface Score {
  contentId: string;
  type: "quiz" | "test";
  scorePercent: number;
  passed?: boolean;
  videoTitle: string;
  courseTitle: string;
  completedAt: Date | string | null;
}

interface ScoreHistoryProps {
  scores: Score[];
  labels: DashboardLabels;
}

function relativeTime(date: Date | string | null, labels: DashboardLabels): string {
  if (!date) return "—";

  const then = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return labels.justNow;
  if (diffMin < 60) return `${diffMin} ${labels.minAgo}`;
  if (diffHr < 24) return `${diffHr} ${labels.hrAgo}`;
  if (diffDay < 7) return `${diffDay} ${labels.dayAgo}`;
  if (diffWeek < 5) return `${diffWeek} ${labels.weekAgo}`;
  return `${diffMonth} ${labels.monthAgo}`;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return "text-[var(--success)]";
  if (pct >= 50) return "text-yellow-500";
  return "text-[var(--error)]";
}

export function ScoreHistory({ scores, labels }: ScoreHistoryProps) {
  if (scores.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm p-8 text-center">
        <p className="text-muted-foreground">{labels.noScores}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
      {scores.map((score) => (
        <div key={score.contentId} className="flex items-start gap-4 px-5 py-4">
          <span
            className={cn(
              "shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-xs font-medium border",
              score.type === "quiz"
                ? "bg-secondary text-foreground border-border"
                : "bg-primary/10 text-primary border-primary/20"
            )}
          >
            {score.type === "quiz" ? labels.quiz : labels.test}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{score.videoTitle}</p>
            <p className="text-xs text-muted-foreground truncate">{score.courseTitle}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{relativeTime(score.completedAt, labels)}</p>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className={cn("font-mono font-bold text-lg leading-none", scoreColor(score.scorePercent))}>
              {score.scorePercent}%
            </span>
            {score.type === "test" && score.passed !== undefined && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded font-medium",
                  score.passed
                    ? "bg-[var(--success)]/15 text-[var(--success)]"
                    : "bg-[var(--error)]/15 text-[var(--error)]"
                )}
              >
                {score.passed ? labels.pass : labels.fail}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
