/**
 * Pizza Details Dynamic Route Page
 *
 * What it does:
 * Renders the detail page for a specific pizza identified by its `id` URL parameter
 * (e.g., /menu/pizza-1).
 *
 * Why it exists:
 * Provides a dedicated dynamic route for customizing and ordering individual pizzas.
 *
 * Where it belongs:
 * src/app/menu/[id]/page.tsx
 */

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FULL_MENU_PIZZAS, type PizzaProduct } from "@/constants/landing-data";
import { prisma } from "@/lib/prisma";
import PizzaDetailsClient from "./PizzaDetailsClient";

export interface PizzaDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function getPizzaById(id: string): Promise<PizzaProduct | null> {
  const normalizedId = id.trim();

  const fallbackPizza = FULL_MENU_PIZZAS.find(
    (item) => item.id === normalizedId || item.id === normalizedId.replace(/^piz-/, "pizza-")
  );

  try {
    const pizzaFromDb = await prisma.pizza.findUnique({ where: { id: normalizedId } });

    if (pizzaFromDb) {
      return {
        id: pizzaFromDb.id,
        name: pizzaFromDb.name,
        description: pizzaFromDb.description,
        price: Number(pizzaFromDb.price),
        image: pizzaFromDb.image,
        category: (pizzaFromDb.category as PizzaProduct["category"]) || "Classic",
        ingredients: (() => {
          try {
            return JSON.parse(pizzaFromDb.ingredients || "[]");
          } catch {
            return [];
          }
        })(),
        badge: fallbackPizza?.badge,
        isPopular: fallbackPizza?.isPopular,
      };
    }
  } catch {
    // Fall back to the static menu data if Prisma is unavailable.
  }

  return fallbackPizza ?? null;
}

export default async function PizzaDetailsPage(props: PizzaDetailsPageProps) {
  /** Await params promise in accordance with Next.js 15+ App Router rules */
  const { id } = await props.params;

  /** Resolve the pizza from the database first, then fall back to the static menu dataset */
  const pizza = await getPizzaById(id);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content (pt-16 offsets the fixed navbar) */}
      <main className="pt-16">
        {pizza ? (
          <PizzaDetailsClient pizza={pizza} />
        ) : (
          <section className="py-20">
            <div className="mx-auto max-w-xl px-4 text-center">
              <div className="flex flex-col items-center text-center rounded-3xl border border-dashed border-border/70 p-12">
                <h2 className="text-xl font-bold text-foreground">Pizza Not Found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No pizza matching ID &quot;{id}&quot; was found in our menu.
                </p>
                <Button className="mt-6 font-semibold" variant="outline">
                  <Link href="/menu">Browse Menu</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
