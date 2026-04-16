"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScoreRing } from "./score-ring";
import { StatusTag } from "./status-tag";
import type { MiniMetric } from "@/lib/types";

interface RecommendationCardProps {
  rank: number;
  title: string;
  score: number;
  metrics: MiniMetric[];
  advantages: string[];
  risks: string[];
  onViewDetails?: () => void;
}

function rankBg(rank: number) {
  if (rank === 1) return "bg-navy-900";
  if (rank === 2) return "bg-navy-700";
  return "bg-steel-500";
}

export function RecommendationCard({
  rank,
  title,
  score,
  metrics,
  advantages,
  risks,
  onViewDetails,
}: RecommendationCardProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setAnimated(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "bg-white border border-border rounded-card shadow-card",
        "transition-[box-shadow,border-color,transform] duration-200 ease-out",
        "hover:shadow-card-raised hover:border-navy-900/15 hover:-translate-y-[1px]",
        "p-5",
      )}
    >
      <div className="flex items-center gap-5">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-white text-[14px] shrink-0",
            rankBg(rank),
          )}
        >
          {rank}
        </div>

        <ScoreRing score={score} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <h3 className="font-sans text-[18px] font-bold text-carbon leading-tight">
              {title}
            </h3>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500">
              Рекомендация #{rank}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-3">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500">
                    {m.label}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-carbon">
                    {m.value}
                  </span>
                </div>
                <div className="w-full h-[5px] bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full"
                    style={{
                      width: animated ? `${m.value}%` : "0%",
                      transition:
                        "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {advantages.map((a, i) => (
              <StatusTag key={`adv-${i}`} variant="positive">
                {a}
              </StatusTag>
            ))}
            {risks.map((r, i) => (
              <StatusTag key={`risk-${i}`} variant="warning">
                {r}
              </StatusTag>
            ))}
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className={cn(
            "shrink-0 font-sans text-[14px] font-semibold text-navy-700",
            "hover:bg-blue-50 rounded-[8px] py-2 px-3 transition-colors duration-200",
          )}
        >
          Подробнее →
        </button>
      </div>
    </div>
  );
}
