/**
 * Menu Page
 *
 * What it does:
 * Renders the full Pizza House menu with real-time search filtering,
 * category tab filtering, sorting controls, and an animated responsive pizza card grid.
 *
 * Where it belongs:
 * src/app/menu/page.tsx (accessible at /menu)
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import MenuSort, { SortOption } from "@/components/MenuSort";
import MenuGrid from "@/components/MenuGrid";
import { FULL_MENU_PIZZAS, MenuCategory } from "@/constants/landing-data";

export default function MenuPage() {
  /** State for search query text input */
  const [searchQuery, setSearchQuery] = useState("");

  /** State for currently selected category filter tab */
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>("All");

  /** State for sorting option */
  const [sortOption, setSortOption] = useState<SortOption>("default");

  /** State for pizzas list (fetched from /api/pizzas or fallback) */
  const [pizzas, setPizzas] = useState(FULL_MENU_PIZZAS);

  /** Fetch pizzas from API endpoint on mount */
  useEffect(() => {
    fetch("/api/pizzas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pizzas) && data.pizzas.length > 0) {
          setPizzas(data.pizzas);
        }
      })
      .catch(() => {
        // Silently fallback to static dataset
      });
  }, []);

  /**
   * Filtered & Sorted pizza list.
   */
  const filteredPizzas = useMemo(() => {
    const list = pizzas.filter((pizza) => {
      const matchesCategory =
        selectedCategory === "All" || pizza.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pizza.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortOption === "price-low") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOption === "price-high") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortOption === "popular") {
      return [...list].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [pizzas, searchQuery, selectedCategory, sortOption]);

  /** Resets search query, category filter, and sort option */
  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortOption("default");
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
            <div className="mt-10 flex flex-col items-center gap-6 w-full max-w-full">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Results Count & Sorting Controls */}
            <div className="mt-8 mb-2 flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-border/40 text-sm text-muted-foreground">
              <div>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredPizzas.length}
                </span>{" "}
                {filteredPizzas.length === 1 ? "pizza" : "pizzas"}
              </div>

              <MenuSort currentSort={sortOption} onSortChange={setSortOption} />
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
