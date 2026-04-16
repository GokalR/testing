"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { scoreColor } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, { px: number; stroke: number; font: number }> = {
  sm: { px: 48, stroke: 4, font: 14 },
  md: { px: 72, stroke: 6, font: 20 },
  lg: { px: 96, stroke: 8, font: 28 },
};

interface ScoreRingProps {
  score: number;
  size?: Size;
  label?: string;
}

export function ScoreRing({ score, size = "md", label }: ScoreRingProps) {
  const { px, stroke, font } = sizeMap[size];
  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setAnimated(score), 50);
    return () => window.clearTimeout(t);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: px, height: px }}>
        <svg
          width={px}
          height={px}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            strokeWidth={stroke}
            stroke="#F1F2F7"
            fill="none"
          />
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            strokeWidth={stroke}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 800ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-mono font-bold text-carbon",
          )}
          style={{ fontSize: font, letterSpacing: "-0.5px" }}
        >
          {score}
        </div>
      </div>
      {label && (
        <div className="font-sans font-semibold uppercase text-steel-500 text-[11px] tracking-[0.8px]">
          {label}
        </div>
      )}
    </div>
  );
}
