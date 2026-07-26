/**
 * Order Data Structure Types
 *
 * What it does:
 * Defines centralized TypeScript interfaces and types for orders, items, customer info,
 * payment methods, and order tracking statuses.
 *
 * Where it belongs:
 * src/types/order.ts
 */

export type OrderStatusType = "Pending" | "Preparing" | "Out for Delivery" | "Delivered";

export interface CustomerInfo {
  fullName: string;
  email?: string;
  phone: string;
  city?: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  pizzaId: string;
  name: string;
  image: string;
  size: "Small" | "Medium" | "Large";
  toppings: string[];
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatusType;
  createdAt: string;
}
