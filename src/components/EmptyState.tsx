/**
 * EmptyState Component
 *
 * What it does:
 * Renders an informative empty state message with a reset button when no menu items match the user's search or filter query.
 *
 * Why it exists:
 * Provides clear visual feedback and a one-click recovery action when search results are empty.
 *
 * Where it belongs:
 * src/components/EmptyState.tsx
 */

import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Component Props Interface */
export interface EmptyStateProps {
  searchQuery?: string;
  onReset: () => void;
}

export default function EmptyState({ searchQuery, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/40 p-12 text-center backdrop-blur-sm">
      {/* Icon Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
        <SearchX className="h-8 w-8" />
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">
        No Pizzas Found
      </h3>

      {/* Description */}
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {searchQuery ? (
          <>
            We couldn&apos;t find any pizzas matching &quot;
            <span className="font-semibold text-foreground">{searchQuery}</span>
            &quot;.
          </>
        ) : (
          "No pizzas match the selected category filter."
        )}
      </p>

      {/* Reset CTA Action */}
      <div className="mt-6">
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2 border-border/80 font-semibold hover:bg-muted/50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
