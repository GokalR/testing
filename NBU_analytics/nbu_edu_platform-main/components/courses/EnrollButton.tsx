"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EnrollButtonLabels {
  enroll: string;
  enrolled: string;
  signIn: string;
}

export interface EnrollButtonProps {
  courseId: string;
  labels: EnrollButtonLabels;
  signInHref?: string;
}

export function EnrollButton({ courseId, labels, signInHref = "/login" }: EnrollButtonProps) {
  const { data: session, status } = useSession();
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function check() {
      try {
        const res = await fetch(`/api/courses/${courseId}/enroll`);
        if (res.ok) {
          const data = (await res.json()) as { enrolled: boolean };
          setEnrolled(data.enrolled);
        } else {
          setEnrolled(false);
        }
      } catch {
        setEnrolled(false);
      }
    }

    void check();
  }, [courseId, status]);

  if (status === "loading" || (status === "authenticated" && enrolled === null)) {
    return <div className="h-11 w-48 animate-pulse rounded-full bg-secondary" />;
  }

  if (!session) {
    return (
      <Link
        href={signInHref}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--edu-accent-hover)]"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        {labels.signIn}
      </Link>
    );
  }

  if (enrolled) {
    return (
      <span className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[var(--success)] px-6 text-sm font-semibold text-[var(--success)]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {labels.enrolled}
      </span>
    );
  }

  async function handleEnroll() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
      if (res.ok || res.status === 409) {
        setEnrolled(true);
      } else {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("[EnrollButton] POST failed:", res.status, body);
        setError(body.error ?? `Error ${res.status}`);
      }
    } catch (err) {
      console.error("[EnrollButton] Network error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--edu-accent-hover)]",
          loading && "cursor-not-allowed opacity-60",
        )}
      >
        {loading ? "…" : labels.enroll}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
