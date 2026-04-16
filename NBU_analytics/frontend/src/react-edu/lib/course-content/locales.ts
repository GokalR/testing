import type { LocalizedText, SupportedLocale } from "@/react-edu/lib/course-content/types";
import { supportedLocales } from "@/react-edu/lib/course-content/types";

export const defaultLocale: SupportedLocale = "ru";

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export function resolveLocale(value: string): SupportedLocale {
  return isSupportedLocale(value) ? value : defaultLocale;
}

export function getLocalizedText(
  value: LocalizedText,
  locale: SupportedLocale,
): string {
  return value[locale] || value[defaultLocale];
}
