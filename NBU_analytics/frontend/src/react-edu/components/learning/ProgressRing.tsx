
import { motion } from "framer-motion";
import { cn } from "@/react-edu/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProgressRingProps {
  value: number; // 0–100
  size?: number; // diameter in px, default 120
  strokeWidth?: number; // default 8
  label?: string; // text below the number
  className?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function ringColor(value: number): string {
  if (value >= 80) return "text-[var(--success)]";
  if (value >= 60) return "text-primary";
  return "text-[var(--error)]";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}: ProgressRingProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Geometry
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedValue / 100) * circumference;

  const colorClass = ringColor(clampedValue);

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-2", className)}
      aria-label={`Progress: ${Math.round(clampedValue)}%${label ? `, ${label}` : ""}`}
    >
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          className="rotate-[-90deg]"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-secondary"
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            className={colorClass}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-mono font-bold tabular-nums leading-none",
              colorClass,
              size >= 100 ? "text-2xl" : "text-lg"
            )}
          >
            {Math.round(clampedValue)}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5 leading-none">
            %
          </span>
        </div>
      </div>

      {/* Optional label below */}
      {label && (
        <span className="text-xs text-muted-foreground font-medium text-center">
          {label}
        </span>
      )}
    </div>
  );
}
