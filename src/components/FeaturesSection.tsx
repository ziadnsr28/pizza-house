/**
 * FeaturesSection Component
 *
 * What it does:
 * Renders a responsive 6-card grid highlighting the key advantages of Pizza House
 * (Wood-Fired Oven, Fresh Ingredients, Fast Delivery, Master Chefs, Premium Quality, Custom Toppings).
 *
 * Why it exists:
 * Builds trust and communicates the restaurant's commitment to quality.
 *
 * Where it belongs:
 * src/components/FeaturesSection.tsx
 */

"use client";

import { motion } from "framer-motion";
import { Flame, Clock, Leaf, ChefHat, Award, Utensils } from "lucide-react";
import { FEATURES_DATA, FeatureItem } from "@/constants/landing-data";

/** Map icon strings from data to actual Lucide React Icon components */
const ICON_MAP: Record<string, React.ElementType> = {
  Flame: Flame,
  Clock: Clock,
  Leaf: Leaf,
  ChefHat: ChefHat,
  Award: Award,
  Utensils: Utensils,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-card/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Why Choose Pizza House
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Crafted With Passion & Tradition
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            We combine old-world Italian tradition with modern culinary excellence to deliver the finest artisan pizzas in Egypt.
          </p>
        </motion.div>

        {/* Features 6-Card Responsive Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES_DATA.map((feature: FeatureItem, index: number) => {
            const IconComponent = ICON_MAP[feature.iconName] || Flame;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative flex flex-col items-start rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Feature Icon Badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/25">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Feature Title */}
                <h3 className="mt-6 text-lg font-bold tracking-tight text-foreground">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
