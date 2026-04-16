export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/3 rounded-lg bg-secondary" />
          <div className="h-4 w-2/3 rounded bg-secondary" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-secondary" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
