export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-10">
          {/* Page heading */}
          <div className="space-y-2">
            <div className="h-9 w-1/3 rounded-lg bg-secondary" />
            <div className="h-4 w-1/2 rounded bg-secondary" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-xl bg-secondary/40 p-5">
                <div className="h-4 w-1/2 rounded bg-secondary" />
                <div className="h-8 w-2/3 rounded-lg bg-secondary" />
                <div className="h-3 w-3/4 rounded bg-secondary" />
              </div>
            ))}
          </div>

          {/* Enrolled courses */}
          <div className="space-y-4">
            <div className="h-6 w-1/4 rounded bg-secondary" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-xl bg-secondary/40 p-4">
                  <div className="h-36 w-full rounded-lg bg-secondary" />
                  <div className="h-5 w-3/4 rounded bg-secondary" />
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <div className="h-3 w-1/4 rounded bg-secondary" />
                      <div className="h-3 w-10 rounded bg-secondary" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary" />
                  </div>
                  <div className="h-9 w-full rounded-lg bg-secondary" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent scores list */}
          <div className="space-y-4">
            <div className="h-6 w-1/4 rounded bg-secondary" />
            <div className="rounded-xl bg-secondary/40 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-secondary py-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-secondary" />
                    <div className="space-y-1">
                      <div className="h-4 w-40 rounded bg-secondary" />
                      <div className="h-3 w-24 rounded bg-secondary" />
                    </div>
                  </div>
                  <div className="h-6 w-14 rounded-full bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
