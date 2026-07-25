/**
 * AboutSection Component
 *
 * What it does:
 * Displays the Pizza House story, quality philosophy, fresh ingredients promise,
 * and experience highlights in a responsive image + text layout with Framer Motion animations.
 *
 * Where it belongs:
 * src/components/AboutSection.tsx
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Flame, Heart, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-16 md:py-24 bg-card/30 backdrop-blur-sm border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center lg:gap-16">
          
          {/* Left Column: Story Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative lg:col-span-6"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[36px] border border-border/60 shadow-2xl">
              <Image
                src="/images/hero-pizza.png"
                alt="Wood-fired oven artisan pizza crafting"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>

            {/* Experience Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 z-20 flex items-center gap-3.5 rounded-3xl border border-white/10 bg-black/85 px-5 py-4 shadow-2xl backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">15+ Years</p>
                <p className="text-xs text-zinc-400">Master Italian Crafting</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Story Text & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6 lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold text-accent w-fit">
              <Heart className="h-3.5 w-3.5 fill-accent" />
              <span>Our Passion & Story</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Crafted With Passion, Baked to Perfection
            </h2>

            <p className="text-base leading-relaxed text-muted-foreground">
              Founded in Cairo, Pizza House was born from a simple mission: bringing authentic Neapolitan wood-fired pizza to Egypt. Every pie is handcrafted using 48-hour slow-fermented dough, imported San Marzano tomatoes, and 100% fresh buffalo mozzarella.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">900°F Brick Oven</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Smoky crispy crust in 90 seconds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Organic Ingredients</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Daily prepared fresh produce.</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
