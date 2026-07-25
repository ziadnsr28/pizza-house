/**
 * Favorite Pizzas Zustand Store
 *
 * What it does:
 * Manages user's favorited pizza IDs with persistent localStorage storage.
 *
 * Where it belongs:
 * src/stores/favorite-store.ts
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface FavoriteState {
  favoriteIds: string[];

  // Actions
  toggleFavorite: (pizzaId: string) => void;
  isFavorite: (pizzaId: string) => boolean;
  clearFavorites: () => void;
  getTotalFavorites: () => number;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      /** Toggle favorite status for a pizza ID */
      toggleFavorite: (pizzaId: string) => {
        const current = get().favoriteIds;
        if (current.includes(pizzaId)) {
          set({ favoriteIds: current.filter((id) => id !== pizzaId) });
        } else {
          set({ favoriteIds: [...current, pizzaId] });
        }
      },

      /** Check if a pizza ID is favorited */
      isFavorite: (pizzaId: string) => {
        return get().favoriteIds.includes(pizzaId);
      },

      /** Clear all favorited pizzas */
      clearFavorites: () => set({ favoriteIds: [] }),

      /** Get total number of favorited pizzas */
      getTotalFavorites: () => get().favoriteIds.length,
    }),
    {
      name: "pizza-house-favorites-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
