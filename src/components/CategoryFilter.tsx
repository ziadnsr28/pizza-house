/**
 * CategoryFilter Component
 *
 * What it does:
 * Renders a row of category pill buttons ("All", "Classic", "Vegetarian", "Spicy", "Special").
 *
 * Why it exists:
 * Allows users to filter the pizza menu by diet or flavor style.
 *
 * Where it belongs:
 * src/components/CategoryFilter.tsx
 */

import { MENU_CATEGORIES, MenuCategory } from "@/constants/landing-data";
import { cn } from "@/lib/utils";

/** Component Props Interface */
export interface CategoryFilterProps {
  selectedCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex w-full items-center justify-center overflow-x-auto py-2 no-scrollbar">
      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 p-1.5 backdrop-blur-md">
        {MENU_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
