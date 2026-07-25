/**
 * Pizza Details Dynamic Route Page
 *
 * What it does:
 * Renders the detail page for a specific pizza identified by its `id` URL parameter.
 * (e.g., /menu/pizza-1).
 *
 * Why it exists:
 * Provides a dedicated dynamic route structure for viewing individual pizza details.
 *
 * Where it belongs:
 * src/app/menu/[id]/page.tsx
 */

import Link from "next/link";
import { ArrowLeft, Pizza } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FULL_MENU_PIZZAS } from "@/constants/landing-data";

/** Dynamic Route Page Props Interface (Next.js 15/16 params are Promises) */
export interface PizzaDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PizzaDetailsPage(props: PizzaDetailsPageProps) {
  /** Await params promise in accordance with Next.js 15+ App Router rules */
  const { id } = await props.params;

  /** Find matching pizza item from full dataset */
  const pizza = FULL_MENU_PIZZAS.find((item) => item.id === id);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content (pt-16 offsets the fixed navbar) */}
      <main className="pt-16">
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Link href="/menu" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Full Menu
                </Link>
              </Button>
            </div>

            {/* Pizza Details Placeholder Card */}
            {pizza ? (
              <div className="flex flex-col items-center text-center rounded-3xl border border-border/60 bg-card/60 p-8 sm:p-12 backdrop-blur-md shadow-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <Pizza className="h-8 w-8" />
                </div>

                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent mb-3">
                  {pizza.category} Pizza
                </span>

                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {pizza.name}
                </h1>

                <p className="mt-4 max-w-lg text-base text-muted-foreground">
                  {pizza.description}
                </p>

                <div className="mt-6 text-2xl font-bold text-accent">
                  EGP {pizza.price.toFixed(2)}
                </div>

                <div className="mt-8 flex gap-4">
                  <Button size="lg" className="font-semibold shadow-md shadow-primary/20">
                    Order {pizza.name}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center rounded-3xl border border-dashed border-border/70 p-12">
                <h2 className="text-xl font-bold text-foreground">Pizza Not Found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No pizza matching ID &quot;{id}&quot; was found in our menu.
                </p>
                <Button className="mt-6 font-semibold" variant="outline">
                  <Link href="/menu">Browse Menu</Link>
                </Button>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
