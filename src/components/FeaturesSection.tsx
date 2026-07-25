/**
 * FeaturesSection Component
 *
 * What it does:
 * Renders a 3-column grid highlighting the key advantages of Pizza House
 * (Wood-Fired Oven, 100% Fresh Ingredients, 30-Minute Express Delivery).
 *
 * Why it exists:
 * Builds trust and communicates the restaurant's commitment to quality.
 *
 * Where it belongs:
 * src/components/FeaturesSection.tsx
 */

import { Flame, Clock, Leaf } from "lucide-react";
import { FEATURES_DATA, FeatureItem } from "@/constants/landing-data";

/** Map icon strings from data to actual Lucide React Icon components */
const ICON_MAP = {
  Flame: Flame,
  Clock: Clock,
  Leaf: Leaf,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-card/30 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
            Why Choose Pizza House
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Crafted With Passion & Tradition
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            We combine old-world Italian tradition with modern culinary excellence.
          </p>
        </div>

        {/* Features 3-Column Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURES_DATA.map((feature: FeatureItem) => {
            const IconComponent = ICON_MAP[feature.iconName];

            return (
              <div
                key={feature.id}
                className="group relative flex flex-col items-start rounded-2xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Feature Icon Badge */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Feature Title */}
                <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
