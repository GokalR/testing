import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const THIN_SPACE = "\u2009";

export function formatNumber(n: number | string): string {
  const str = typeof n === "number" ? Math.round(n).toString() : n.replace(/\s/g, "");
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
}

export function formatDecimal(n: number, fractionDigits = 1): string {
  const [intPart, frac] = n.toFixed(fractionDigits).split(".");
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
  return frac !== undefined ? `${intFormatted},${frac}` : intFormatted;
}

export function scoreColor(score: number): string {
  if (score < 40) return "#DC2626";
  if (score < 60) return "#D97706";
  if (score < 80) return "#2957A2";
  return "#059669";
}
