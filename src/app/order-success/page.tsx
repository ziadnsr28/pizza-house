/**
 * Order Success Page Component
 *
 * What it does:
 * Displays an animated order confirmation screen with Framer Motion,
 * showing the generated Order ID, OrderStatus tracking timeline,
 * customer information summary, ordered items list, total price, and action buttons.
 *
 * Where it belongs:
 * src/app/order-success/page.tsx
 */

"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, Phone, User, ShoppingBag, ArrowRight, ListOrdered } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderStatus from "@/components/OrderStatus";
import OrderItemComponent from "@/components/OrderItem";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/order-store";
import { Order, OrderItem } from "@/types/order";
import { formatPrice } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function OrderSuccessPage() {
  const isClient = useIsClient();
  const activeOrder = useOrderStore((state) => state.getActiveOrder());

  /** Fallback dummy order if page accessed directly */
  const order: Order = activeOrder || {
    id: "PH-849201",
    customer: {
      fullName: "Guest Customer",
      phone: "01012345678",
      address: "Downtown, Cairo, Egypt",
    },
    items: [
      {
        id: "pizza-1-Medium",
        pizzaId: "pizza-1",
        name: "Margherita Supreme",
        image: "/images/pizza-margherita.png",
        size: "Medium",
        toppings: ["Extra Cheese"],
        quantity: 1,
        price: 200,
      },
    ],
    paymentMethod: "Cash On Delivery",
    subtotal: 200,
    deliveryFee: 30,
    totalAmount: 230,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content (pt-16 offsets fixed navbar) */}
      <main className="pt-16">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Framer Motion Entrance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-10 backdrop-blur-md shadow-2xl"
            >
              {/* Success Check Icon Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 shadow-inner mb-6"
              >
                <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
              </motion.div>

              {/* Header Badge & Title */}
              <span className="rounded-full bg-emerald-500/15 px-4 py-1 text-xs font-bold text-emerald-500 mb-3">
                Order Placed Successfully
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Thank You for Your Order!
              </h1>

              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Your order is confirmed and sent directly to our kitchen. Track your order status below.
              </p>

              {/* Order Status Timeline Component */}
              <div className="mt-8 w-full border-t border-b border-border/40 py-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 text-left">
                  Live Order Tracker
                </h3>
                <OrderStatus status={isClient ? order.status : "Pending"} />
              </div>

              {/* Order Metadata Summary Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/50 bg-background/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Order Number</p>
                    <p className="text-sm font-bold text-foreground">{order.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/50 bg-background/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Estimated Delivery</p>
                    <p className="text-sm font-bold text-foreground">30–40 Minutes</p>
                  </div>
                </div>
              </div>

              {/* Customer Information Summary Card */}
              <div className="mt-6 p-5 rounded-2xl border border-border/50 bg-background/40 w-full text-left flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Delivery & Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <User className="h-4 w-4 text-primary shrink-0" />
                    <span>{order.customer.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>{order.customer.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-foreground font-medium pt-2 border-t border-border/30">
                  <MapPin className="h-4 w-4 text-accent shrink-0" />
                  <span>{order.customer.address}</span>
                </div>
              </div>

              {/* Ordered Items Breakdown List */}
              <div className="mt-6 w-full text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Ordered Items ({order.items.length})
                </h4>
                <div className="flex flex-col gap-3">
                  {order.items.map((item: OrderItem) => (
                    <OrderItemComponent key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Receipt Totals Summary */}
              <div className="mt-6 flex justify-between items-center w-full p-4 rounded-2xl border border-border/50 bg-card/80 text-sm">
                <div className="flex flex-col text-left text-xs text-muted-foreground">
                  <span>Payment Method: <strong className="text-foreground">{order.paymentMethod}</strong></span>
                  <span>Subtotal: {formatPrice(order.subtotal)} | Delivery: {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Total Amount</span>
                  <span className="text-xl font-extrabold text-accent">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-lg shadow-primary/25 rounded-2xl h-12">
                  <Link href="/orders" className="flex items-center gap-2">
                    <ListOrdered className="h-4 w-4" />
                    View Order History
                  </Link>
                </Button>

                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold rounded-2xl h-12">
                  <Link href="/menu" className="flex items-center gap-2">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

            </motion.div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
