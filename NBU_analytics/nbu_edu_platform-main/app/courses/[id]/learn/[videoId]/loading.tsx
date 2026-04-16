export default function LearningPageLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="animate-pulse space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 rounded bg-secondary" />
            <div className="h-4 w-4 rounded bg-secondary" />
            <div className="h-4 w-32 rounded bg-secondary" />
            <div className="h-4 w-4 rounded bg-secondary" />
            <div className="h-4 w-24 rounded bg-secondary" />
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Left: video player + info (3 cols) */}
            <div className="space-y-5 lg:col-span-3">
              {/* 16:9 video player placeholder */}
              <div className="aspect-video w-full rounded-xl bg-secondary" />

              {/* Video title */}
              <div className="space-y-2">
                <div className="h-7 w-3/4 rounded-lg bg-secondary" />
                <div className="flex gap-4">
                  <div className="h-4 w-20 rounded bg-secondary" />
                  <div className="h-4 w-24 rounded bg-secondary" />
                </div>
              </div>

              {/* Description lines */}
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-secondary" />
                <div className="h-4 w-5/6 rounded bg-secondary" />
                <div className="h-4 w-2/3 rounded bg-secondary" />
              </div>

              {/* Prev / Next navigation */}
              <div className="flex justify-between pt-2">
                <div className="h-10 w-32 rounded-lg bg-secondary" />
                <div className="h-10 w-32 rounded-lg bg-secondary" />
              </div>
            </div>

            {/* Right: sidebar tabs (2 cols) */}
            <div className="space-y-4 lg:col-span-2">
              {/* Tab bar */}
              <div className="flex gap-2 rounded-lg bg-secondary/40 p-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 flex-1 rounded-md bg-secondary" />
                ))}
              </div>

              {/* Tab content area */}
              <div className="space-y-3 rounded-xl bg-secondary/40 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div
                      className="h-4 rounded bg-secondary"
                      style={{ width: `${60 + (i % 3) * 15}%` }}
                    />
                    {i % 2 === 0 && (
                      <div className="h-4 w-1/2 rounded bg-secondary" />
                    )}
                  </div>
                ))}
              </div>

              {/* Video list in sidebar */}
              <div className="space-y-2 pt-2">
                <div className="h-5 w-1/3 rounded bg-secondary" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/40 p-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-secondary" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-2/3 rounded bg-secondary" />
                      <div className="h-3 w-1/3 rounded bg-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
