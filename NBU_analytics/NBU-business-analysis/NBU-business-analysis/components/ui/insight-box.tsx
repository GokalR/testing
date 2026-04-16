import { cn } from "@/lib/utils";
import type { InsightVariant } from "@/lib/types";

const variantStyles: Record<
  InsightVariant,
  { bg: string; border: string; title: string }
> = {
  info: {
    bg: "bg-[rgba(239,246,255,0.5)]",
    border: "border-l-navy-700",
    title: "text-navy-900",
  },
  warning: {
    bg: "bg-[rgba(255,251,235,0.5)]",
    border: "border-l-amber-600",
    title: "text-[#92400E]",
  },
  danger: {
    bg: "bg-[rgba(254,242,242,0.5)]",
    border: "border-l-red-600",
    title: "text-[#991B1B]",
  },
  success: {
    bg: "bg-[rgba(236,253,245,0.5)]",
    border: "border-l-green-600",
    title: "text-[#065F46]",
  },
};

interface InsightBoxProps {
  variant: InsightVariant;
  title?: string;
  children: React.ReactNode;
}

export function InsightBox({ variant, title, children }: InsightBoxProps) {
  const s = variantStyles[variant];
  return (
    <div
      className={cn(
        "border-l-[3px] rounded-r-[8px] py-3 px-4",
        s.bg,
        s.border,
      )}
    >
      {title && (
        <div
          className={cn("font-sans text-[13px] font-bold mb-1", s.title)}
        >
          {title}
        </div>
      )}
      <div className="font-sans text-[13px] font-medium text-carbon leading-[1.6]">
        {children}
      </div>
    </div>
  );
}
