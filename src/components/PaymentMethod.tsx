/**
 * PaymentMethod Component
 *
 * What it does:
 * Allows selection between Cash on Delivery, Credit Card (UI only), and Vodafone Cash (UI only).
 * Shows mockup UI input fields when Credit Card is selected.
 *
 * Where it belongs:
 * src/components/PaymentMethod.tsx
 */

"use client";

import { Banknote, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentType = "cod" | "card" | "vodafone";

export interface PaymentMethodProps {
  selectedPayment: PaymentType;
  onSelectPayment: (method: PaymentType) => void;
}

const PAYMENT_OPTIONS = [
  {
    id: "cod" as PaymentType,
    label: "Cash on Delivery",
    description: "Pay with cash upon arrival",
    Icon: Banknote,
  },
  {
    id: "card" as PaymentType,
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, Meeza",
    Icon: CreditCard,
  },
  {
    id: "vodafone" as PaymentType,
    label: "Vodafone Cash",
    description: "Pay via Vodafone mobile wallet",
    Icon: Smartphone,
  },
];

export default function PaymentMethod({
  selectedPayment,
  onSelectPayment,
}: PaymentMethodProps) {
  return (
    <div className="flex flex-col gap-4" role="group" aria-labelledby="payment-heading">
      <p id="payment-heading" className="text-sm font-semibold text-foreground">
        Select Payment Method <span className="text-destructive" aria-hidden="true">*</span>
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PAYMENT_OPTIONS.map(({ id, label, description, Icon }) => {
          const isSelected = selectedPayment === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectPayment(id)}
              aria-pressed={isSelected}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
                isSelected
                  ? "border-primary bg-primary/15 text-foreground shadow-md shadow-primary/10"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Credit Card UI Mockup */}
      {selectedPayment === "card" && (
        <div className="mt-1 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>256-bit SSL Encrypted Payment</span>
          </div>

          <div>
            <label htmlFor="card-number" className="block text-xs font-medium text-muted-foreground mb-1">
              Card Number
            </label>
            <input
              id="card-number"
              type="text"
              placeholder="4000 1234 5678 9010"
              className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="card-expiry" className="block text-xs font-medium text-muted-foreground mb-1">
                Expiry Date
              </label>
              <input
                id="card-expiry"
                type="text"
                placeholder="MM/YY"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="card-cvc" className="block text-xs font-medium text-muted-foreground mb-1">
                CVC / CVV
              </label>
              <input
                id="card-cvc"
                type="text"
                placeholder="123"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Vodafone Cash UI Mockup */}
      {selectedPayment === "vodafone" && (
        <div className="mt-1 flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            <span>Vodafone Cash Wallet Payment</span>
          </div>
          <div>
            <label htmlFor="vodafone-number" className="block text-xs font-medium text-muted-foreground mb-1">
              Vodafone Mobile Number
            </label>
            <input
              id="vodafone-number"
              type="tel"
              placeholder="01XXXXXXXXX"
              className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            A confirmation code will be sent to your Vodafone number to complete payment.
          </p>
        </div>
      )}
    </div>
  );
}
