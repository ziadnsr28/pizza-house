/**
 * Order History Page Component
 *
 * What it does:
 * Renders the order history page listing all past orders saved in Zustand order-store.
 * Displays Order ID, date, status badge, items count, total price, and details expander.
 *
 * Where it belongs:
 * src/app/orders/page.tsx (accessible at /orders)
 */

"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ListOrdered, ShoppingBag, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderItemComponent from "@/components/OrderItem";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/order-store";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function OrdersPage() {
  const isClient = useIsClient();
  const orders = useOrderStore((state) => state.orders);

  const displayOrders = isClient ? orders : [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content (pt-16 offsets fixed navbar) */}
      <main className="pt-16">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            
            {/* Page Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                <ListOrdered className="h-3.5 w-3.5" />
                <span>My Account</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Order History
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Track your recent pizza orders and view receipt details.
              </p>
            </div>

            {/* Orders List or Empty State */}
            {displayOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/40 p-12 text-center backdrop-blur-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No Orders Found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  You haven&apos;t placed any orders yet. Explore our menu to place your first order!
                </p>
                <Button className="mt-6 font-semibold shadow-md shadow-primary/20" size="lg">
                  <Link href="/menu" className="flex items-center gap-2">
                    Browse Full Menu
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {displayOrders.map((order: Order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-md shadow-xl"
                  >
                    {/* Order Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-base font-bold text-foreground">{order.id}</span>
                          <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">Total Amount</span>
                          <span className="text-lg font-extrabold text-accent">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <Button variant="outline" size="sm" className="font-semibold rounded-xl">
                          <Link href="/order-success">Track Order</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-3">
                      {order.items.map((item) => (
                        <OrderItemComponent key={item.id} item={item} />
                      ))}
                    </div>

                    {/* Customer & Address Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border/30">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                        <span>Delivering to: <strong className="text-foreground">{order.customer.address}</strong></span>
                      </span>
                      <span>Payment: <strong className="text-foreground">{order.paymentMethod}</strong></span>
                    </div>
                  </div>
                ))}
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
