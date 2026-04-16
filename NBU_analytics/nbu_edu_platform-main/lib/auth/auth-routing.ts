import { defaultLocale, isSupportedLocale } from "@/lib/course-content/locales";
import type { SupportedLocale } from "@/lib/course-content/types";

export type AuthPage = "login" | "register";

export function getLocaleFromCookieValue(
  value: string | null | undefined,
): SupportedLocale {
  return value && isSupportedLocale(value) ? value : defaultLocale;
}

export function getLocaleFromPathname(pathname: string): SupportedLocale | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  return firstSegment && isSupportedLocale(firstSegment) ? firstSegment : null;
}

export function getPreferredLocale(options: {
  pathname?: string | null;
  cookieValue?: string | null;
}): SupportedLocale {
  if (options.pathname) {
    const pathLocale = getLocaleFromPathname(options.pathname);
    if (pathLocale) {
      return pathLocale;
    }
  }

  return getLocaleFromCookieValue(options.cookieValue);
}

export function getAuthHref(
  locale: SupportedLocale,
  page: AuthPage,
  callbackUrl?: string | null,
): string {
  const params = new URLSearchParams();
  if (callbackUrl) {
    params.set("callbackUrl", callbackUrl);
  }

  const query = params.toString();
  return query ? `/${locale}/${page}?${query}` : `/${locale}/${page}`;
}

export function normalizeCallbackUrl(
  value: string | string[] | null | undefined,
): string | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate) {
    return undefined;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return undefined;
  }

  return candidate;
}
