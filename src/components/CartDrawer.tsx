/**
 * CartDrawer Component
 *
 * What it does:
 * Renders a responsive slide-over cart drawer listing all added items,
 * quantity controls, item removal buttons, price summary (subtotal, delivery fee, total),
 * checkout action, and an empty state fallback.
 *
 * Why it exists:
 * Provides immediate shopping cart feedback and order review across the entire application.
 *
 * Where it belongs:
 * src/components/CartDrawer.tsx
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/QuantitySelector";
import { useCartStore, CartItem } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTotalPrice,
  } = useCartStore();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-300"
      />

      {/* Drawer Panel Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-card/95 border-l border-border/60 shadow-2xl backdrop-blur-xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Your Order</h2>
                <p className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"} in cart
                </p>
              </div>
            </div>

            <button
              onClick={() => setCartOpen(false)}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body: Items List or Empty State */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center my-auto py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Your Cart is Empty</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Looks like you haven&apos;t added any delicious pizzas to your order yet.
                </p>
                <Button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 font-semibold shadow-md shadow-primary/20"
                >
                  <Link href="/menu">Explore Menu</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {items.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm"
                  >
                    {/* Item Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/30">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-accent font-semibold mt-0.5">
                            {item.size} ({formatPrice(item.price)})
                          </p>
                          {item.toppings.length > 0 && (
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              + {item.toppings.join(", ")}
                            </p>
                          )}
                        </div>

                        {/* Remove Item Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/30">
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => increaseQuantity(item.id)}
                          onDecrease={() => decreaseQuantity(item.id)}
                          size="sm"
                        />
                        <span className="text-sm font-bold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors text-center py-2"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>

          {/* Footer: Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border/50 bg-card/60 backdrop-blur-md flex flex-col gap-4">
              
              {/* Delivery threshold indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/10 text-accent p-2.5 rounded-xl border border-accent/20">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>
                  {subtotal >= 500
                    ? "🎉 You qualified for FREE Delivery!"
                    : `Add ${formatPrice(500 - subtotal)} more for FREE Delivery`}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-2 text-sm">
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
                <div className="flex justify-between text-base font-extrabold text-foreground pt-2 border-t border-border/40">
                  <span>Total</span>
                  <span className="text-accent">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Button
                size="lg"
                className="w-full gap-2 text-base font-bold shadow-xl shadow-primary/25 rounded-2xl h-12"
              >
                Checkout — {formatPrice(totalPrice)}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
