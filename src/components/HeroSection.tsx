/**
 * HeroSection Component
 *
 * What it does:
 * Renders the main Hero banner at the top of the Pizza House landing page.
 * Includes badge tag, headline, description, primary/secondary CTA buttons,
 * key social proof stats, and an animated Hero pizza image container with a floating quality badge.
 *
 * Why it exists:
 * Creates a visually stunning first impression that converts visitors into customers.
 *
 * Where it belongs:
 * src/components/HeroSection.tsx
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-36">
      {/* Video Background */}
<div className="absolute inset-0 -z-20">
  <video
    className="w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
    poster="/images/hero-pizza.png"
    src="/videos/pizza-making.mp4"
  />
  <div className="absolute inset-0 bg-black/40" />
</div>
{/* Subtle Background Glow Accent */}
<div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px] sm:h-[500px] sm:w-[500px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left"
          >
            {/* Top Highlight Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
              <Flame className="h-4 w-4 text-primary animate-pulse" />
              <span>Handcrafted Fresh Daily</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.15]">
              Artisan Pizza <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-red-500 to-amber-400 bg-clip-text text-transparent">
                Baked to Perfection
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Experience authentic wood-fired pizza made with 100% organic San Marzano tomatoes,
              fresh buffalo mozzarella, and 48-hour fermented dough.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-bold shadow-lg shadow-primary/25">
                <Link href="/menu" className="flex items-center gap-2">
                  Explore Menu
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold border-border/80 hover:bg-muted/50"
              >
                <Link href="#about">Our Story</Link>
              </Button>
            </div>

            {/* Social Proof & Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-border/40 w-full">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-foreground sm:text-3xl">15k+</span>
                <span className="text-xs text-muted-foreground mt-0.5">Happy Diners</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="flex items-center gap-1 text-2xl font-bold text-accent sm:text-3xl">
                  4.9 <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">5,000+ Reviews</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="flex items-center gap-1 text-2xl font-bold text-foreground sm:text-3xl">
                  30<span className="text-primary text-sm font-semibold">min</span>
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">Hot Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center lg:col-span-5"
          >
            {/* Outer Relative Wrapper */}
            <div className="relative w-full max-w-[420px] sm:max-w-[480px]">
              
              {/* Glowing Background Ring Accent */}
              <div className="absolute -inset-2 rounded-[40px] bg-gradient-to-tr from-primary/30 via-amber-500/20 to-primary/10 blur-2xl" />

              {/* Premium Image Container: rounded-[36px], overflow-hidden */}
              <div className="relative aspect-square w-full overflow-hidden rounded-[36px] border border-white/10 bg-card/40 shadow-2xl shadow-black/60 backdrop-blur-sm group">
                <Image
                  src="/images/hero-pizza.png"
                  alt="Artisan Wood-Fired Pepperoni Pizza"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Soft Dark Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/**
               * Refined Floating Quality Badge:
               * - `bottom-5`: 20px spacing from the bottom edge.
               * - `-left-2 sm:-left-4`: Hugs the bottom-left corner with ~20-25% extending outside and ~75-80% inside.
               * - `z-20`: Kept elevated above the hero image.
               */}
              <div className="absolute -bottom-7 -left-2 sm:-left-15 z-20 flex items-center gap-3.5 rounded-3xl border border-white/10 bg-black/75 px-5 py-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:scale-105">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-inner">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">100% Quality Guaranteed</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Fresh ingredients daily</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
