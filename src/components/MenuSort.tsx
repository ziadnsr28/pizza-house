/**
 * MenuSort Component
 *
 * What it does:
 * Renders a select dropdown allowing users to sort menu pizzas by:
 * - Default
 * - Price: Low to High
 * - Price: High to Low
 * - Most Popular
 *
 * Where it belongs:
 * src/components/MenuSort.tsx
 */

import { ArrowUpDown } from "lucide-react";

export type SortOption = "default" | "price-low" | "price-high" | "popular";

export interface MenuSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function MenuSort({ currentSort, onSortChange }: MenuSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-xl border border-border/60 bg-card/80 px-3 py-2 text-xs font-semibold text-foreground backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      >
        <option value="default">Default Order</option>
        <option value="popular">Most Popular</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
