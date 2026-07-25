/**
 * OrderStatus Component
 *
 * What it does:
 * Renders a responsive order status timeline showing progress steps:
 * 1. Pending (Order Placed)
 * 2. Preparing (Kitchen Baking)
 * 3. Out for Delivery (On the road)
 * 4. Delivered (Arrived)
 *
 * Where it belongs:
 * src/components/OrderStatus.tsx
 */

"use client";

import { CheckCircle2, Clock, UtensilsCrossed, Truck, PackageCheck } from "lucide-react";
import { OrderStatusType } from "@/types/order";

export interface OrderStatusProps {
  status: OrderStatusType;
}

const STEPS: { status: OrderStatusType; label: string; icon: React.ElementType }[] = [
  { status: "Pending", label: "Order Received", icon: Clock },
  { status: "Preparing", label: "Preparing Pizza", icon: UtensilsCrossed },
  { status: "Out for Delivery", label: "Out for Delivery", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: PackageCheck },
];

export default function OrderStatus({ status }: OrderStatusProps) {
  const currentStepIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.status}
              className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-300 ${
                isCurrent
                  ? "border-primary bg-primary/15 text-primary shadow-md shadow-primary/10"
                  : isCompleted
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                  : "border-border/60 bg-card/40 text-muted-foreground opacity-60"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 transition-colors ${
                  isCurrent
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-muted/60 text-muted-foreground"
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <span className="text-xs font-bold">{step.label}</span>
              <span className="text-[10px] mt-0.5 opacity-80">Step {index + 1} of 4</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
