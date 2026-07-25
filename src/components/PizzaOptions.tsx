/**
 * PizzaOptions Component
 *
 * What it does:
 * Renders size selection tabs (Small, Medium, Large) and extra topping checkboxes
 * (Extra Cheese, Mushrooms, Pepperoni, Olives) with price adjustment labels.
 *
 * Why it exists:
 * Allows customers to customize their pizza before adding it to the cart.
 *
 * Where it belongs:
 * src/components/PizzaOptions.tsx
 */

import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export type PizzaSize = "Small" | "Medium" | "Large";

export interface ToppingOption {
  id: string;
  name: string;
  price: number; // Price in EGP
}

/** Available extra toppings list */
export const AVAILABLE_TOPPINGS: ToppingOption[] = [
  { id: "extra-cheese", name: "Extra Cheese", price: 25 },
  { id: "mushrooms", name: "Mushrooms", price: 20 },
  { id: "pepperoni", name: "Pepperoni", price: 35 },
  { id: "olives", name: "Olives", price: 15 },
];

/** Size options list */
export const SIZE_OPTIONS: { size: PizzaSize; label: string; priceMultiplier: number }[] = [
  { size: "Small", label: "Small (10\")", priceMultiplier: 0.85 },
  { size: "Medium", label: "Medium (12\")", priceMultiplier: 1.0 },
  { size: "Large", label: "Large (14\")", priceMultiplier: 1.25 },
];

export interface PizzaOptionsProps {
  selectedSize: PizzaSize;
  onSizeChange: (size: PizzaSize) => void;
  selectedToppings: string[];
  onToppingToggle: (toppingName: string) => void;
}

export default function PizzaOptions({
  selectedSize,
  onSizeChange,
  selectedToppings,
  onToppingToggle,
}: PizzaOptionsProps) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Size Selection */}
      <div>
        <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-3">
          Select Size
        </label>
        <div className="grid grid-cols-3 gap-3">
          {SIZE_OPTIONS.map((opt) => {
            const isSelected = selectedSize === opt.size;
            return (
              <button
                key={opt.size}
                type="button"
                onClick={() => onSizeChange(opt.size)}
                className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isSelected
                    ? "border-primary bg-primary/15 text-primary shadow-md shadow-primary/10"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span className="text-sm font-bold">{opt.size}</span>
                <span className="text-[11px] opacity-80 mt-0.5">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Extra Toppings Selection */}
      <div>
        <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-3">
          Extra Toppings (Optional)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AVAILABLE_TOPPINGS.map((topping) => {
            const isChecked = selectedToppings.includes(topping.name);
            return (
              <button
                key={topping.id}
                type="button"
                onClick={() => onToppingToggle(topping.name)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isChecked
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                      isChecked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-muted/40"
                    }`}
                  >
                    {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-sm font-medium">{topping.name}</span>
                </div>
                <span className="text-xs font-semibold text-accent">
                  +{formatPrice(topping.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
