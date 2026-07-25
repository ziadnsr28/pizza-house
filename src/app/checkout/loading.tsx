/**
 * Checkout Page Skeleton Loading Component
 *
 * What it does:
 * Displays skeleton placeholders for checkout form and order summary card.
 *
 * Where it belongs:
 * src/app/checkout/loading.tsx
 */

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 rounded-xl bg-muted/80 animate-pulse mb-8" />
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Form Skeleton */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="h-64 rounded-3xl border border-border/40 bg-card/40 p-6 animate-pulse" />
            <div className="h-40 rounded-3xl border border-border/40 bg-card/40 p-6 animate-pulse" />
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-5">
            <div className="h-96 rounded-3xl border border-border/40 bg-card/40 p-6 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
