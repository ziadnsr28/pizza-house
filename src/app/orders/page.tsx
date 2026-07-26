/**
 * Order History Page Component
 *
 * What it does:
 * Renders the order history page listing all past orders saved in Zustand order-store.
 * Shows mock status progression for each order. Protects route by redirecting
 * unauthenticated users to /login?returnUrl=/orders.
 *
 * Where it belongs:
 * src/app/orders/page.tsx (accessible at /orders)
 */

"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ListOrdered,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderItemComponent from "@/components/OrderItem";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/** Maps status to badge styling */
function getStatusStyle(status: Order["status"]) {
  switch (status) {
    case "Pending":
      return "bg-amber-500/15 text-amber-500";
    case "Preparing":
      return "bg-blue-500/15 text-blue-500";
    case "Out for Delivery":
      return "bg-primary/15 text-primary";
    case "Delivered":
      return "bg-emerald-500/15 text-emerald-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/** Maps payment method string to icon */
function PaymentIcon({ method }: { method: string }) {
  if (method.toLowerCase().includes("vodafone")) return <Smartphone className="h-3.5 w-3.5" />;
  if (method.toLowerCase().includes("card") || method.toLowerCase().includes("credit"))
    return <CreditCard className="h-3.5 w-3.5" />;
  return <Banknote className="h-3.5 w-3.5" />;
}

export default function OrdersPage() {
  const router = useRouter();
  const isClient = useIsClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeOrders = useOrderStore((state) => state.orders);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/login?returnUrl=/orders");
      return;
    }

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          setApiOrders(data.orders);
        }
      })
      .catch(() => {});
  }, [isClient, isAuthenticated, router]);

  const displayOrders = isClient && isAuthenticated
    ? apiOrders.length > 0 ? apiOrders : storeOrders
    : [];

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
                <ListOrdered className="h-3.5 w-3.5" aria-hidden="true" />
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
                  <ShoppingBag className="h-8 w-8" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-foreground">No Orders Found</h2>
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
                {displayOrders.map((order: Order, index: number) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
                    className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl"
                  >
                    {/* Order Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-border/40">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">{order.id}</span>
                          <span
                            className={cn(
                              "rounded-full px-3 py-0.5 text-xs font-semibold",
                              getStatusStyle(order.status)
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              dateStyle: "medium",
                            })}
                            {" · "}
                            {new Date(order.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <PaymentIcon method={order.paymentMethod} />
                          <span>{order.paymentMethod}</span>
                        </p>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-muted-foreground block">Total Amount</span>
                          <span className="text-lg font-extrabold text-accent">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="font-semibold rounded-xl shrink-0">
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
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        <span>
                          Delivering to:{" "}
                          <strong className="text-foreground">
                            {order.customer.city
                              ? `${order.customer.address}, ${order.customer.city}`
                              : order.customer.address}
                          </strong>
                        </span>
                      </span>
                      <span className="flex flex-col gap-1 sm:text-right">
                        <span>
                          Customer:{" "}
                          <strong className="text-foreground">{order.customer.fullName}</strong>
                        </span>
                        {order.customer.email && (
                          <span className="text-muted-foreground">{order.customer.email}</span>
                        )}
                      </span>
                    </div>
                  </motion.div>
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
