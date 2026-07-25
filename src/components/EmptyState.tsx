/**
 * EmptyState Component
 *
 * What it does:
 * Renders a flexible, reusable empty state message with custom icon, title,
 * description, and CTA action button.
 *
 * Where it belongs:
 * src/components/EmptyState.tsx
 */

import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  searchQuery?: string;
  actionLabel?: string;
  onAction?: () => void;
  onReset?: () => void;
}

export default function EmptyState({
  icon: Icon = SearchX,
  title = "No Pizzas Found",
  description,
  searchQuery,
  actionLabel = "Reset Filters",
  onAction,
  onReset,
}: EmptyStateProps) {
  const handleAction = onAction || onReset;

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/40 p-12 text-center backdrop-blur-sm">
      {/* Icon Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
        <Icon className="h-8 w-8" />
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description ? (
          description
        ) : searchQuery ? (
          <>
            We couldn&apos;t find any pizzas matching &quot;
            <span className="font-semibold text-foreground">{searchQuery}</span>
            &quot;.
          </>
        ) : (
          "No pizzas match the selected category filter."
        )}
      </p>

      {/* Action Button */}
      {handleAction && (
        <div className="mt-6">
          <Button
            onClick={handleAction}
            variant="outline"
            className="gap-2 border-border/80 font-semibold hover:bg-muted/50 rounded-2xl"
          >
            <RotateCcw className="h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
