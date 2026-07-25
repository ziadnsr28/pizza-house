/**
 * Menu Page Skeleton Loading Component
 *
 * What it does:
 * Displays skeleton placeholders for search bar, category tabs, and pizza grid cards.
 *
 * Where it belongs:
 * src/app/menu/loading.tsx
 */

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center">
          <div className="h-6 w-32 rounded-full bg-muted animate-pulse mb-3" />
          <div className="h-10 w-64 rounded-2xl bg-muted animate-pulse mb-2" />
          <div className="h-4 w-80 rounded-lg bg-muted/60 animate-pulse" />
        </div>

        {/* Controls Skeleton */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="h-12 w-full max-w-md rounded-2xl bg-muted/80 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-9 w-20 rounded-full bg-muted/60 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Pizza Grid Skeleton */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-border/40 bg-card/40 p-4">
              <div className="aspect-[4/3] w-full rounded-xl bg-muted/60 animate-pulse mb-4" />
              <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse mb-2" />
              <div className="h-4 w-full rounded-md bg-muted/60 animate-pulse mb-4" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-20 rounded-md bg-muted animate-pulse" />
                <div className="h-9 w-24 rounded-xl bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
