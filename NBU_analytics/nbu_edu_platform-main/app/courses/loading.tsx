export default function CoursesLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-10">
          {/* Page heading */}
          <div className="space-y-3">
            <div className="h-9 w-1/4 rounded-lg bg-secondary" />
            <div className="h-4 w-1/2 rounded bg-secondary" />
          </div>

          {/* Filter/search bar area */}
          <div className="flex gap-4">
            <div className="h-10 w-64 rounded-lg bg-secondary" />
            <div className="h-10 w-32 rounded-lg bg-secondary" />
          </div>

          {/* Course card grid — 6 cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4 rounded-xl bg-secondary/40 p-4">
                {/* Thumbnail */}
                <div className="h-44 w-full rounded-lg bg-secondary" />
                {/* Title */}
                <div className="h-5 w-3/4 rounded bg-secondary" />
                {/* Subtitle */}
                <div className="h-4 w-1/2 rounded bg-secondary" />
                {/* Meta row */}
                <div className="flex gap-3">
                  <div className="h-4 w-16 rounded bg-secondary" />
                  <div className="h-4 w-20 rounded bg-secondary" />
                </div>
                {/* CTA button */}
                <div className="h-9 w-full rounded-lg bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
