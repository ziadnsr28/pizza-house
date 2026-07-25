/**
 * PaymentMethod Component
 *
 * What it does:
 * Allows selection between Cash on Delivery and Credit Card payment options.
 * Shows mockup UI input fields when Credit Card is selected.
 *
 * Why it exists:
 * Provides clean payment selection UI for checkout.
 *
 * Where it belongs:
 * src/components/PaymentMethod.tsx
 */

"use client";

import { Banknote, CreditCard, ShieldCheck } from "lucide-react";

export type PaymentType = "cod" | "card";

export interface PaymentMethodProps {
  selectedPayment: PaymentType;
  onSelectPayment: (method: PaymentType) => void;
}

export default function PaymentMethod({
  selectedPayment,
  onSelectPayment,
}: PaymentMethodProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="block text-sm font-semibold text-foreground">
        Select Payment Method <span className="text-destructive">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cash On Delivery Option */}
        <button
          type="button"
          onClick={() => onSelectPayment("cod")}
          className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedPayment === "cod"
              ? "border-primary bg-primary/15 text-foreground shadow-md shadow-primary/10"
              : "border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
              selectedPayment === "cod"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Cash On Delivery</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pay with cash upon arrival</p>
          </div>
        </button>

        {/* Credit Card Option */}
        <button
          type="button"
          onClick={() => onSelectPayment("card")}
          className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedPayment === "card"
              ? "border-primary bg-primary/15 text-foreground shadow-md shadow-primary/10"
              : "border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
              selectedPayment === "card"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Credit / Debit Card</p>
            <p className="text-xs text-muted-foreground mt-0.5">Visa, Mastercard, Meeza</p>
          </div>
        </button>
      </div>

      {/* Credit Card UI Mockup */}
      {selectedPayment === "card" && (
        <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <ShieldCheck className="h-4 w-4" />
            <span>Encrypted 256-bit SSL Payment Gateway</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Card Number</label>
            <input
              type="text"
              placeholder="4000 1234 5678 9010"
              className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">CVC / CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
