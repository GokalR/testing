import { cn } from "@/lib/utils";
import type { KpiStatus, Trend } from "@/lib/types";

const topBorderByStatus: Record<KpiStatus, string> = {
  positive: "border-t-green-600",
  negative: "border-t-red-600",
  info: "border-t-gold-500",
  neutral: "border-t-navy-700",
};

interface KpiCardProps {
  label: string;
  value: string;
  subtitle: string;
  trend?: Trend;
  status?: KpiStatus;
}

export function KpiCard({
  label,
  value,
  subtitle,
  trend,
  status = "neutral",
}: KpiCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-card shadow-card",
        "transition-[box-shadow,border-color] duration-200 ease-out",
        "hover:shadow-card-hover hover:border-navy-900/15",
        "border-t-[2.5px] py-4 px-5",
        topBorderByStatus[status],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-sans font-semibold uppercase text-steel-500 text-[11px] tracking-[0.8px] mb-1">
            {label}
          </div>
          <div className="font-mono font-bold text-carbon text-[28px] leading-[1.1] tracking-[-0.5px]">
            {value}
          </div>
          <div className="font-sans font-medium text-gray-600 text-[12px] mt-1">
            {subtitle}
          </div>
        </div>
        {trend && <TrendPill trend={trend} />}
      </div>
    </div>
  );
}

function TrendPill({ trend }: { trend: Trend }) {
  const base =
    "inline-flex items-center font-sans font-semibold text-[11px] tracking-[0.3px] rounded-tag py-[3px] px-2 whitespace-nowrap";
  if (trend.direction === "up") {
    return (
      <span className={cn(base, "bg-green-50 text-green-600")}>
        ▲ {trend.value}
      </span>
    );
  }
  if (trend.direction === "down") {
    return (
      <span className={cn(base, "bg-red-50 text-red-600")}>
        ▼ {trend.value}
      </span>
    );
  }
  return <span className={cn(base, "bg-gray-100 text-gray-600")}>{trend.value}</span>;
}
