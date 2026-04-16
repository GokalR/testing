"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import type { SupportedLocale } from "@/lib/course-content/types";
import {
  getHeaderLabels,
  getLocaleSwitchLabel,
} from "@/lib/course-content/ui-copy";
import { getAuthHref, getPreferredLocale } from "@/lib/auth/auth-routing";

function getCookieLocaleValue(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  return match?.[1] ?? null;
}

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const locale: SupportedLocale = useMemo(
    () => getPreferredLocale({ pathname, cookieValue: getCookieLocaleValue() }),
    [pathname],
  );

  const labels = useMemo(() => getHeaderLabels(locale), [locale]);
  const localizedSuffix = pathname.startsWith(`/${locale}`)
    ? pathname.slice(`/${locale}`.length)
    : "";

  const homeHref = `/${locale}`;
  const coursesHref = `/${locale}/courses`;
  const signInHref = getAuthHref(locale, "login", pathname);

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link
            href={homeHref}
            className="font-heading text-xl font-bold text-foreground transition-opacity hover:opacity-80"
          >
            EduPulse
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href={coursesHref}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {labels.browseCourses}
            </Link>

            {session ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {labels.dashboard}
              </Link>
            ) : null}

            {session?.user?.role === "admin" ? (
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <nav className="flex items-center gap-2">
            {(["ru", "uz", "en"] as const).map((targetLocale) => {
              const href = pathname.startsWith(`/${locale}`)
                ? `/${targetLocale}${localizedSuffix || ""}`
                : `/${targetLocale}`;

              return (
                <Link
                  key={targetLocale}
                  href={href}
                  className={`rounded-full px-3 py-2 text-sm transition-colors ${
                    targetLocale === locale
                      ? "bg-primary text-primary-foreground"
                      : "text-[color:var(--text-secondary)] hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {getLocaleSwitchLabel(locale, targetLocale)}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <div
                key="loading"
                className="h-8 w-20 animate-pulse rounded-full bg-secondary"
              />
            ) : session ? (
              <motion.div
                key="user"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-foreground sm:block">
                  {session.user?.name}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut({ callbackUrl: homeHref })}
                  className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {labels.signOut}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="signin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link
                  href={signInHref}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {labels.signIn}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
