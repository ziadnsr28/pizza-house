/**
 * SearchBar Component
 *
 * What it does:
 * Renders a responsive search input bar filling full width on mobile (320px-768px)
 * and constrained to max-w-xl on desktop.
 *
 * Where it belongs:
 * src/components/SearchBar.tsx
 */

import { Search, X } from "lucide-react";

/** Component Props Interface */
export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search pizzas by name or ingredients...",
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-full sm:max-w-xl">
      {/* Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
        <Search className="h-5 w-5" />
      </div>

      {/* Controlled Input Field */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border/60 bg-card/80 py-3.5 pl-11 pr-11 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 shadow-md backdrop-blur-md transition-all focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Clear Button (appears only when input has text) */}
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20">
            <X className="h-3.5 w-3.5" />
          </div>
        </button>
      )}
    </div>
  );
}
