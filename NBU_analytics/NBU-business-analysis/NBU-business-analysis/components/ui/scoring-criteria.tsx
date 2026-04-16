"use client";

import { useEffect, useState } from "react";
import { cn, scoreColor } from "@/lib/utils";

interface ScoringCriteriaProps {
  label: string;
  score: number;
  description: string;
  improvements?: string[];
}

export function ScoringCriteria({
  label,
  score,
  description,
  improvements,
}: ScoringCriteriaProps) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setAnimated(score), 50);
    return () => window.clearTimeout(t);
  }, [score]);

  const color = scoreColor(score);

  return (
    <div className="bg-white border border-border rounded-card shadow-card p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="font-sans text-[14px] font-semibold text-carbon">
          {label}
        </div>
        <div
          className="font-mono text-[16px] font-bold tabular-nums"
          style={{ color }}
        >
          {score}
        </div>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${animated}%`,
            background: color,
            transition: "width 800ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <p className="font-sans text-[13px] font-medium text-gray-600 mt-2 leading-[1.6]">
        {description}
      </p>
      {improvements && improvements.length > 0 && (
        <ul className="mt-3 space-y-1">
          {improvements.map((imp, i) => (
            <li
              key={i}
              className={cn(
                "flex items-start gap-2",
                "font-sans text-[12px] font-medium text-carbon",
              )}
            >
              <span className="text-gold-500 mt-[1px] leading-none">•</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
