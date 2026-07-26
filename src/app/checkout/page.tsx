/**
 * Checkout Page Component
 *
 * What it does:
 * Renders the main checkout flow combining CheckoutForm, PaymentMethod, and OrderSummary.
 * Saves order to Zustand order-store, clears cart, and navigates to /order-success upon submission.
 * Redirects empty cart users back to /menu.
 *
 * Where it belongs:
 * src/app/checkout/page.tsx
 */

"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm, { CheckoutFormData } from "@/components/CheckoutForm";
import PaymentMethod, { PaymentType } from "@/components/PaymentMethod";
import OrderSummary from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const isClient = useIsClient();

  const { items, clearCart, getSubtotal, getDeliveryFee, getTotalPrice } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);

  const [selectedPayment, setSelectedPayment] = useState<PaymentType>("cod");

  /** Map internal payment ID to display label */
  const paymentLabels: Record<PaymentType, string> = {
    cod: "Cash on Delivery",
    card: "Credit / Debit Card",
    vodafone: "Vodafone Cash",
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  /** Redirect to /login if not authenticated, or to /menu if cart is empty after client mount */
  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated) {
        router.push("/login?returnUrl=/checkout");
      } else if (items.length === 0) {
        router.push("/menu");
      }
    }
  }, [isClient, isAuthenticated, items, router]);

  /** Form submit handler */
  const handleOrderSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    const newOrder: Order = {
      id: `PH-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        address: data.address,
        notes: data.notes,
      },
      items: [...items],
      paymentMethod: paymentLabels[selectedPayment],
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      totalAmount: getTotalPrice(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      // Send API request to backend
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: newOrder.items,
          totalAmount: newOrder.totalAmount,
        }),
      });
    } catch {
      // Gracefully continue with client state if API fails
    }

    // Save to Zustand order store and sessionStorage fallback
    addOrder(newOrder);
    sessionStorage.setItem("last_order_receipt", JSON.stringify(newOrder));

    // Clear cart & navigate to success page
    setTimeout(() => {
      clearCart();
      router.push("/order-success");
    }, 400);
  };

  if (!isClient || items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Redirecting to menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content (pt-16 offsets fixed navbar) */}
      <main className="pt-16">
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Back to Menu Link */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Link href="/menu" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Menu
                </Link>
              </Button>
            </div>

            {/* Page Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Final Step</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Checkout & Order Confirmation
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Please enter your shipping address and choose a payment method.
              </p>
            </div>

            {/* Checkout Grid */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
              
              {/* Left Column: Form & Payment Method */}
              <div className="flex flex-col gap-8 lg:col-span-7">
                <div className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl">
                  <h2 className="text-xl font-bold text-foreground mb-6">Delivery Details</h2>
                  <CheckoutForm onSubmit={handleOrderSubmit} formId="checkout-form" />
                </div>

                <div className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl">
                  <PaymentMethod
                    selectedPayment={selectedPayment}
                    onSelectPayment={setSelectedPayment}
                  />
                </div>
              </div>

              {/* Right Column: Order Summary & Place Order Button */}
              <div className="flex flex-col gap-6 lg:col-span-5 sticky top-24">
                <OrderSummary />

                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full gap-2 text-base font-bold shadow-xl shadow-primary/25 rounded-2xl h-14"
                >
                  {isSubmitting ? (
                    "Processing Order..."
                  ) : (
                    <>
                      Place Order — {formatPrice(getTotalPrice())}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
