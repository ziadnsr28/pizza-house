/**
 * Favorites Page Component
 *
 * What it does:
 * Renders the customer's saved favorite pizzas grid using PizzaCard.
 * Displays EmptyState fallback if no pizzas are favorited.
 *
 * Where it belongs:
 * src/app/favorites/page.tsx (accessible at /favorites)
 */

"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PizzaCard from "@/components/PizzaCard";
import EmptyState from "@/components/EmptyState";
import { FULL_MENU_PIZZAS } from "@/constants/landing-data";
import { useFavoriteStore } from "@/stores/favorite-store";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function FavoritesPage() {
  const isClient = useIsClient();
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);

  const activeIds = isClient ? favoriteIds : [];

  const favoritePizzas = FULL_MENU_PIZZAS.filter((pizza) =>
    activeIds.includes(pizza.id)
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content (pt-16 offsets fixed navbar) */}
      <main className="pt-16">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Page Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-semibold text-red-500">
                <Heart className="h-3.5 w-3.5 fill-red-500" />
                <span>My Saved Items</span>
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Favorite Pizzas
              </h1>

              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Your personal collection of saved artisan wood-fired pizzas.
              </p>
            </div>

            {/* Grid or Empty State */}
            {favoritePizzas.length === 0 ? (
              <div className="max-w-xl mx-auto">
                <EmptyState
                  icon={Heart}
                  title="No Favorite Pizzas Saved"
                  description="You haven't saved any pizzas to your favorites list yet. Click the heart icon on any pizza card to save it!"
                  actionLabel="Explore Full Menu"
                  onAction={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/menu";
                    }
                  }}
                />
              </div>
            ) : (
              <div>
                <div className="mb-6 text-sm text-muted-foreground text-center">
                  Showing <span className="font-bold text-foreground">{favoritePizzas.length}</span> favorited {favoritePizzas.length === 1 ? "pizza" : "pizzas"}
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {favoritePizzas.map((pizza) => (
                    <PizzaCard key={pizza.id} pizza={pizza} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
