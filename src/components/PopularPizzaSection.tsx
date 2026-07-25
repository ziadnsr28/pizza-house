/**
 * PopularPizzaSection Component
 *
 * What it does:
 * Displays a preview grid of 3 popular pizzas using the reusable PizzaCard component.
 *
 * Why it exists:
 * Highlights customer favorites and drives orders directly from the landing page.
 *
 * Where it belongs:
 * src/components/PopularPizzaSection.tsx
 */

import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import PizzaCard from "@/components/PizzaCard";
import { POPULAR_PIZZAS, PizzaProduct } from "@/constants/landing-data";

export default function PopularPizzaSection() {
  return (
    <section id="menu" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold text-accent">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            <span>Customer Favorites</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Our Most Popular Pizzas
          </h2>

          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Handcrafted with 48-hour slow-fermented dough and baked in our 900°F wood-fired brick oven.
          </p>
        </div>

        {/* Responsive Grid of Pizza Cards (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_PIZZAS.map((pizza: PizzaProduct) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>

        {/* Bottom CTA to view full menu */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-border/80 font-semibold hover:bg-muted/50"
          >
            <Link href="/menu" className="flex items-center gap-2">
              Explore Full Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
