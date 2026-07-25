/**
 * OrderItem Component
 *
 * What it does:
 * Renders an individual item row inside order receipt or order history cards
 * (Image, Name, Size, Toppings, Quantity, Price).
 *
 * Where it belongs:
 * src/components/OrderItem.tsx
 */

import Image from "next/image";
import { OrderItem as OrderItemType } from "@/types/order";
import { formatPrice } from "@/lib/utils";

export interface OrderItemProps {
  item: OrderItemType;
}

export default function OrderItemComponent({ item }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm">
      {/* Product Image */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted/30">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h4>
        <div className="flex items-center gap-2 text-xs text-accent font-semibold mt-0.5">
          <span>{item.size}</span>
          <span>•</span>
          <span>Qty: {item.quantity}</span>
        </div>
        {item.toppings && item.toppings.length > 0 && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
            + {item.toppings.join(", ")}
          </p>
        )}
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-foreground shrink-0">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}
