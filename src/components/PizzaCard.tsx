/**
 * PizzaCard Component
 *
 * What it does:
 * Displays an individual pizza item card wrapped in a Next.js Link targeting /menu/[id].
 * Includes image, title, description, formatted EGP price tag, optional badge, FavoriteButton, and "Order Now" CTA.
 * Occupies 100% full width of its parent grid column on all screen sizes.
 *
 * Where it belongs:
 * src/components/PizzaCard.tsx
 */

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";
import { PizzaProduct } from "@/constants/landing-data";
import { formatPrice } from "@/lib/utils";

/** Component Props Interface */
export interface PizzaCardProps {
  pizza: PizzaProduct;
}

export default function PizzaCard({ pizza }: PizzaCardProps) {
  const { id, name, description, price, image, badge } = pizza;

  return (
    <Link
      href={`/menu/${id}`}
      className="block group w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
    >
      <article className="relative flex flex-col w-full h-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10">
        
        {/* Pizza Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Favorite Toggle Button */}
          <div className="absolute top-3 left-3 z-10">
            <FavoriteButton pizzaId={id} pizzaName={name} size="sm" />
          </div>

          {/* Optional Badge Tag */}
          {badge && (
            <span className="absolute top-3 right-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground shadow-md backdrop-blur-md">
              {badge}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 w-full">
          <div>
            {/* Pizza Title */}
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>

            {/* Pizza Description */}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          {/* Card Footer: Price & Order Action */}
          <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-border/40 w-full">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">Price</span>
              <span className="text-lg sm:text-xl font-bold text-accent">
                {formatPrice(price)}
              </span>
            </div>

            {/* Order Now CTA button */}
            <Button
              size="sm"
              tabIndex={-1}
              className="gap-2 font-semibold shadow-md shadow-primary/20 pointer-events-none"
            >
              <ShoppingBag className="h-4 w-4" />
              Order Now
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
