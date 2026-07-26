/**
 * CategoryFilter Component
 *
 * What it does:
 * Renders a touch-friendly, horizontally scrollable row of category tab buttons on mobile.
 * ("All", "Classic", "Vegetarian", "Spicy", "Special").
 *
 * Requirements:
 * - Mobile (320px, 375px, 430px): 100% parent width, overflow-x-auto without scrollbar,
 *   flex-nowrap container, touch-friendly min-width tabs.
 * - Desktop: Centered tab bar layout.
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
    <div className="w-full max-w-full overflow-x-auto py-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-nowrap items-center gap-2 w-max sm:w-auto justify-start sm:justify-center rounded-2xl border border-border/60 bg-card/60 p-1.5 backdrop-blur-md mx-auto px-3 sm:px-1.5">
        {MENU_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "flex-shrink-0 shrink-0 min-w-[64px] sm:min-w-fit whitespace-nowrap rounded-xl px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 touch-manipulation",
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
