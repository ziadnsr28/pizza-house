/**
 * Order Zustand Store
 *
 * What it does:
 * Manages persistent order history and active order tracking for Pizza House.
 * Uses Zustand's `persist` middleware to save orders in localStorage.
 *
 * Why it exists:
 * Provides a unified store for saving orders upon checkout and displaying order details / status history.
 *
 * Where it belongs:
 * src/stores/order-store.ts
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Order, OrderStatusType } from "@/types/order";

export interface OrderState {
  orders: Order[];
  activeOrderId: string | null;

  // Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatusType) => void;
  getActiveOrder: () => Order | null;
  getOrderById: (id: string) => Order | undefined;
  clearOrderHistory: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrderId: null,

      /** Add a newly placed order to history & set as active */
      addOrder: (newOrder) => {
        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrderId: newOrder.id,
        }));
      },

      /** Update status of an order (e.g. Pending -> Preparing -> Out for Delivery -> Delivered) */
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        }));
      },

      /** Get the currently active order object */
      getActiveOrder: () => {
        const { orders, activeOrderId } = get();
        if (!activeOrderId) return orders[0] || null;
        return orders.find((o) => o.id === activeOrderId) || orders[0] || null;
      },

      /** Get specific order by ID */
      getOrderById: (id: string) => {
        return get().orders.find((o) => o.id === id);
      },

      /** Clear order history */
      clearOrderHistory: () => set({ orders: [], activeOrderId: null }),
    }),
    {
      name: "pizza-house-orders-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
