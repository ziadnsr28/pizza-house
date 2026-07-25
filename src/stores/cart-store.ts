/**
 * Shopping Cart Zustand Store
 *
 * What it does:
 * Manages global cart state for Pizza House (adding items, updating quantities,
 * removing items, clearing cart, calculating subtotal, delivery, and total count).
 * Uses Zustand's `persist` middleware to save cart state in localStorage.
 *
 * Why it exists:
 * Provides a unified, persistent state store accessible across Navbar, Pizza Details page, and Cart Drawer.
 *
 * Where it belongs:
 * src/stores/cart-store.ts
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Delivery Fee constant in EGP (Free above 500 EGP or fixed 30 EGP) */
export const DELIVERY_FEE_EGP = 30;

/** Individual item inside the cart */
export interface CartItem {
  id: string; // Unique composite key (pizzaId + size + sorted toppings)
  pizzaId: string;
  name: string;
  basePrice: number;
  price: number; // Unit price including size multiplier and topping add-ons
  image: string;
  size: "Small" | "Medium" | "Large";
  toppings: string[];
  quantity: number;
}

/** State and Actions interface for the Cart Store */
export interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  
  // Getters / Computed values
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

/** Helper function to generate a unique composite ID for identical item configurations */
export function generateCartItemId(
  pizzaId: string,
  size: string,
  toppings: string[]
): string {
  const sortedToppings = [...toppings].sort().join("-");
  return `${pizzaId}-${size}${sortedToppings ? `-${sortedToppings}` : ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      /** Open or close the cart drawer */
      setCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),

      /** Add item to cart or increment quantity if item already exists */
      addItem: (newItem) => {
        const id = generateCartItemId(newItem.pizzaId, newItem.size, newItem.toppings);
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += newItem.quantity;
          set({ items: updatedItems, isCartOpen: true });
        } else {
          set({
            items: [...currentItems, { ...newItem, id }],
            isCartOpen: true,
          });
        }
      },

      /** Remove item by unique composite ID */
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      /** Increase item quantity by 1 */
      increaseQuantity: (id: string) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          get().updateQuantity(id, item.quantity + 1);
        }
      },

      /** Decrease item quantity by 1 (removes if reaches 0) */
      decreaseQuantity: (id: string) => {
        const item = get().items.find((i) => i.id === id);
        if (item) {
          get().updateQuantity(id, item.quantity - 1);
        }
      },

      /** Update item quantity */
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      /** Empty the cart */
      clearCart: () => set({ items: [] }),

      /** Calculate subtotal in EGP */
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      /** Delivery fee (Free if cart is empty or subtotal >= 500 EGP) */
      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 500) return 0;
        return DELIVERY_FEE_EGP;
      },

      /** Total price including subtotal + delivery fee */
      getTotalPrice: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },

      /** Calculate total item count in cart */
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "pizza-house-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
