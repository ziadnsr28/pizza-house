/**
 * Menu Page
 *
 * What it does:
 * Renders the full Pizza House menu with real-time search filtering,
 * category tab filtering, and an animated responsive pizza card grid.
 *
 * Why it exists:
 * Provides customers with a browsable, filterable menu experience.
 *
 * Where it belongs:
 * src/app/menu/page.tsx (accessible at /menu)
 */

"use client";

import { useState, useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import MenuGrid from "@/components/MenuGrid";
import { FULL_MENU_PIZZAS, MenuCategory } from "@/constants/landing-data";

export default function MenuPage() {
  /** State for search query text input */
  const [searchQuery, setSearchQuery] = useState("");

  /** State for currently selected category filter tab */
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");

  /**
   * Filtered pizza list.
   * useMemo recalculates only when searchQuery or selectedCategory changes.
   *
   * Filtering logic:
   * 1. If category is not "All", keep only pizzas matching the selected category.
   * 2. If search query is not empty, keep only pizzas whose name or description
   *    includes the search text (case-insensitive).
   */
  const filteredPizzas = useMemo(() => {
    return FULL_MENU_PIZZAS.filter((pizza) => {
      const matchesCategory =
        selectedCategory === "All" || pizza.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pizza.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  /** Resets both search query and category filter to defaults */
  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Fixed Header Navigation */}
      <Navbar />

      {/* Main Menu Content (pt-16 offsets the 64px fixed navbar) */}
      <main className="pt-16">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            {/* Page Header */}
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold text-accent">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>Our Full Menu</span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Explore Our Pizzas
              </h1>

              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                Browse our full selection of artisan wood-fired pizzas. Use the search bar or filter by category.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="mt-10 flex flex-col items-center gap-6">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Results Count */}
            <div className="mt-8 mb-2 text-center text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredPizzas.length}
              </span>{" "}
              {filteredPizzas.length === 1 ? "pizza" : "pizzas"}
            </div>

            {/* Pizza Grid */}
            <div className="mt-6">
              <MenuGrid
                pizzas={filteredPizzas}
                searchQuery={searchQuery}
                onReset={handleReset}
              />
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
