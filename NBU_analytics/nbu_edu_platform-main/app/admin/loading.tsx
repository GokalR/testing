export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-10">
          {/* Page heading */}
          <div className="space-y-2">
            <div className="h-9 w-1/4 rounded-lg bg-secondary" />
            <div className="h-4 w-2/5 rounded bg-secondary" />
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-xl bg-secondary/40 p-5">
                <div className="h-4 w-1/2 rounded bg-secondary" />
                <div className="h-8 w-2/3 rounded-lg bg-secondary" />
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            {/* Table toolbar */}
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/4 rounded bg-secondary" />
              <div className="h-9 w-32 rounded-lg bg-secondary" />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl bg-secondary/40">
              {/* Header row */}
              <div className="flex gap-6 border-b border-secondary px-6 py-4">
                {["w-1/3", "w-1/5", "w-1/6", "w-1/6", "w-20"].map((w, i) => (
                  <div key={i} className={`h-4 ${w} rounded bg-secondary`} />
                ))}
              </div>

              {/* Data rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 border-b border-secondary/60 px-6 py-4 last:border-0"
                >
                  <div className="h-4 w-1/3 rounded bg-secondary" />
                  <div className="h-4 w-1/5 rounded bg-secondary" />
                  <div className="h-4 w-1/6 rounded bg-secondary" />
                  <div className="h-6 w-1/6 rounded-full bg-secondary" />
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-md bg-secondary" />
                    <div className="h-8 w-8 rounded-md bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
