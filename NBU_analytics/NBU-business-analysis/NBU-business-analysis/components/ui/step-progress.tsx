"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { StepItem } from "@/lib/types";

interface StepProgressProps {
  steps: StepItem[];
  currentStep: number;
  percentage: number;
}

export function StepProgress({ steps, percentage }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <span className="font-mono text-[13px] font-semibold text-carbon">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gold-500 rounded-full"
          style={{
            width: `${percentage}%`,
            transition: "width 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      <div className="flex items-start gap-3">
        {steps.map((step, i) => {
          const num = i + 1;
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "inline-flex items-center gap-2 rounded-full py-2 px-4 min-w-[140px] justify-center transition-colors duration-200",
                  isCompleted && "bg-navy-900 text-white",
                  isActive &&
                    "bg-white border-2 border-gold-500 text-navy-900",
                  !isCompleted &&
                    !isActive &&
                    "bg-gray-100 text-steel-500",
                )}
              >
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0",
                    isCompleted && "bg-white/20 text-white",
                    isActive && "bg-gold-500 text-white",
                    !isCompleted && !isActive && "bg-white text-steel-500",
                  )}
                >
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : num}
                </span>
                <span className="font-sans text-[13px] font-medium">
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
