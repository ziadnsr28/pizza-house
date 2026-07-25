/**
 * Features Page Component
 *
 * What it does:
 * Renders a dedicated page showcasing all restaurant features in a responsive grid
 * with detailed descriptions, icons, and Framer Motion entrance animations.
 *
 * Where it belongs:
 * src/app/features/page.tsx (accessible at /features)
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Clock,
  Leaf,
  ChefHat,
  Award,
  Utensils,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  HeartHandshake,
  Pizza,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/** Extended features dataset for the dedicated page (beyond the 6 on the landing page) */
const FEATURES_EXTENDED = [
  {
    id: "feat-1",
    icon: Flame,
    title: "Wood-Fired Brick Oven",
    description:
      "Our imported Neapolitan brick ovens fire at 900°F, crafting the signature smoky, crispy crust that defines authentic Italian pizza. Each pie bakes in just 90 seconds.",
  },
  {
    id: "feat-2",
    icon: Leaf,
    title: "100% Fresh Ingredients",
    description:
      "Every morning our kitchen team sources organic vegetables, hand-pulls mozzarella, and mixes 48-hour slow-fermented dough — prepared fresh from scratch daily.",
  },
  {
    id: "feat-3",
    icon: Clock,
    title: "30-Minute Hot Delivery",
    description:
      "Our dedicated delivery team guarantees piping-hot pizza at your door within 30 minutes. Track your order in real-time from kitchen to doorstep.",
  },
  {
    id: "feat-4",
    icon: ChefHat,
    title: "Master Italian Chefs",
    description:
      "Our pizzaiolos trained in Naples, mastering traditional hand-stretching, dough-tossing, and wood-fire techniques passed down through generations.",
  },
  {
    id: "feat-5",
    icon: Award,
    title: "Premium Quality Guarantee",
    description:
      "Award-winning recipes using zero artificial additives, preservatives, or flavor enhancers. What you taste is pure, honest, artisan food.",
  },
  {
    id: "feat-6",
    icon: Utensils,
    title: "Custom Toppings & Sizes",
    description:
      "Personalize your pizza with a wide selection of extra toppings, crust styles, and three sizes (Small, Medium, Large) for the perfect meal.",
  },
  {
    id: "feat-7",
    icon: Truck,
    title: "Wide Delivery Coverage",
    description:
      "We deliver across all major districts in Cairo. Free delivery on orders above EGP 300 — no minimum order required.",
  },
  {
    id: "feat-8",
    icon: ShieldCheck,
    title: "Safe & Secure Payments",
    description:
      "Pay with cash on delivery or securely via credit/debit card. SSL-encrypted transactions and PCI-compliant processing.",
  },
  {
    id: "feat-9",
    icon: HeartHandshake,
    title: "Loyalty & Rewards",
    description:
      "Earn points with every order and redeem exclusive discounts, free pizzas, and early access to seasonal specials.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="pt-16">
        {/* ─── Page Header ─── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Why Pizza House</span>
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Our <span className="text-primary">Features</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                Discover what sets Pizza House apart — from imported Neapolitan ovens to 30-minute guaranteed delivery and zero-additive recipes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES_EXTENDED.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/25">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold tracking-tight text-foreground">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA Strip ─── */}
        <section className="py-16 md:py-20 bg-card/30 border-t border-border/40">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Pizza className="h-7 w-7" />
                </div>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to Experience the Best?
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Order your favorite artisan pizza now and discover why thousands of customers choose Pizza House.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2 font-bold shadow-lg shadow-primary/25 rounded-2xl h-12">
                  <Link href="/menu" className="flex items-center gap-2">
                    Order Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 font-semibold rounded-2xl h-12">
                  <Link href="/about" className="flex items-center gap-2">
                    Read Our Story
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
