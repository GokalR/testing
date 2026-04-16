export default function CourseDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-secondary" />
            <div className="h-4 w-4 rounded bg-secondary" />
            <div className="h-4 w-32 rounded bg-secondary" />
          </div>

          {/* Course header */}
          <div className="space-y-4">
            <div className="h-10 w-2/3 rounded-lg bg-secondary" />
            <div className="h-5 w-full rounded bg-secondary" />
            <div className="h-5 w-3/4 rounded bg-secondary" />
            <div className="flex gap-4">
              <div className="h-6 w-24 rounded-full bg-secondary" />
              <div className="h-6 w-20 rounded-full bg-secondary" />
              <div className="h-6 w-28 rounded-full bg-secondary" />
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: video list */}
            <div className="space-y-3 lg:col-span-2">
              <div className="h-6 w-1/4 rounded bg-secondary" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg bg-secondary/40 p-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-secondary" />
                    <div className="h-3 w-1/3 rounded bg-secondary" />
                  </div>
                  <div className="h-4 w-12 rounded bg-secondary" />
                </div>
              ))}
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6">
              {/* Enroll card */}
              <div className="space-y-4 rounded-xl bg-secondary/40 p-6">
                <div className="h-6 w-1/2 rounded bg-secondary" />
                <div className="h-4 w-3/4 rounded bg-secondary" />
                <div className="h-4 w-2/3 rounded bg-secondary" />
                <div className="h-11 w-full rounded-lg bg-secondary" />
              </div>
              {/* Info card */}
              <div className="space-y-3 rounded-xl bg-secondary/40 p-6">
                <div className="h-5 w-1/3 rounded bg-secondary" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-1/3 rounded bg-secondary" />
                    <div className="h-4 w-1/4 rounded bg-secondary" />
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
