/**
 * OrderSummary Component
 *
 * What it does:
 * Renders an order summary card listing product images, names, selected sizes,
 * extra toppings, quantities, item totals, subtotal, delivery fee, and grand total.
 *
 * Why it exists:
 * Displays real-time breakdown of items and costs during checkout.
 *
 * Where it belongs:
 * src/components/OrderSummary.tsx
 */

"use client";

import Image from "next/image";
import { ShieldCheck, ShoppingBag } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function OrderSummary() {
  const { items, getSubtotal, getDeliveryFee, getTotalPrice } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalPrice = getTotalPrice();

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-md shadow-xl">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Order Summary</h3>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items List */}
      <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex gap-3 items-center text-sm">
            {/* Image */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Title & Options */}
            <div className="flex flex-1 flex-col">
              <span className="font-bold text-foreground line-clamp-1">{item.name}</span>
              <span className="text-xs text-accent font-semibold">
                {item.size} × {item.quantity}
              </span>
              {item.toppings.length > 0 && (
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                  + {item.toppings.join(", ")}
                </span>
              )}
            </div>

            {/* Total Price for item */}
            <span className="font-bold text-foreground shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Delivery Banner */}
      <div className="flex items-center gap-2 text-xs text-accent bg-accent/10 p-3 rounded-2xl border border-accent/20">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <span>
          {deliveryFee === 0
            ? "🎉 FREE Delivery applied!"
            : `Standard hot delivery within 30 minutes`}
        </span>
      </div>

      {/* Price Totals */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-border/50 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery Fee</span>
          <span className="font-semibold text-foreground">
            {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-foreground pt-3 border-t border-border/40">
          <span>Grand Total</span>
          <span className="text-xl font-bold text-accent">{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
