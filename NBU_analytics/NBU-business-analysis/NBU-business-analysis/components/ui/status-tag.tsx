import { cn } from "@/lib/utils";
import type { StatusVariant } from "@/lib/types";

const variantStyles: Record<StatusVariant, string> = {
  positive: "bg-green-50 text-green-600",
  negative: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-blue-50 text-navy-700",
  neutral: "bg-gray-100 text-gray-600",
};

interface StatusTagProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

export function StatusTag({ variant, children, className }: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-sans font-semibold",
        "text-[11px] tracking-[0.3px] rounded-tag py-1 px-[10px]",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
