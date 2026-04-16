"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[Global Error Boundary]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md space-y-6 text-center">
        {/* Icon / status indicator */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <span className="font-mono text-2xl text-accent">!</span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl font-semibold text-text-primary">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-base text-text-secondary">
          An unexpected error occurred. Please try again or return to the home page
          if the problem persists.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-secondary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
