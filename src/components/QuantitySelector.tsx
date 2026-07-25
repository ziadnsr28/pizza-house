/**
 * QuantitySelector Component
 *
 * What it does:
 * Renders a reusable + / - quantity control component.
 * Prevents quantity from dropping below min (default: 1).
 *
 * Why it exists:
 * Shared across Pizza Details page and Cart Drawer for consistent quantity adjustments.
 *
 * Where it belongs:
 * src/components/QuantitySelector.tsx
 */

import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = "md",
}: QuantitySelectorProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  /** Size styling mapping */
  const sizeStyles = {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  const buttonSizeStyles = {
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-8 w-8",
  };

  const iconStyles = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm",
        sizeStyles[size]
      )}
    >
      {/* Decrease Button */}
      <button
        type="button"
        onClick={onDecrease}
        disabled={isMin}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/60 text-foreground transition-all hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-40",
          buttonSizeStyles[size]
        )}
      >
        <Minus className={iconStyles[size]} />
      </button>

      {/* Quantity Display */}
      <span className="min-w-[24px] text-center font-bold text-foreground select-none">
        {quantity}
      </span>

      {/* Increase Button */}
      <button
        type="button"
        onClick={onIncrease}
        disabled={isMax}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/60 text-foreground transition-all hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:pointer-events-none disabled:opacity-40",
          buttonSizeStyles[size]
        )}
      >
        <Plus className={iconStyles[size]} />
      </button>
    </div>
  );
}
