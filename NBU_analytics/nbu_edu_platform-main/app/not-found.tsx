import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md space-y-6 text-center">
        {/* Large 404 */}
        <p className="font-mono text-8xl font-bold tracking-tight text-accent">404</p>

        {/* Heading */}
        <h1 className="font-heading text-3xl font-semibold text-text-primary">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-base text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
