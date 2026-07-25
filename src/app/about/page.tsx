/**
 * About Page Component
 *
 * What it does:
 * Renders a professional restaurant About page showcasing Pizza House's story,
 * mission, quality ingredients philosophy, and experience highlights.
 *
 * Where it belongs:
 * src/app/about/page.tsx (accessible at /about)
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Flame,
  Heart,
  ShieldCheck,
  Leaf,
  Clock,
  ChefHat,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/** Milestone statistics displayed in the counter strip */
const MILESTONES = [
  { value: "15+", label: "Years of Experience", icon: Award },
  { value: "200K+", label: "Happy Customers", icon: Heart },
  { value: "50+", label: "Artisan Recipes", icon: ChefHat },
  { value: "4.9", label: "Average Rating", icon: Star },
];

/** Core values cards */
const VALUES = [
  {
    icon: Leaf,
    title: "Fresh Daily Ingredients",
    description:
      "Every morning our kitchen team prepares organic vegetables, hand-pulls mozzarella, and mixes 48-hour fermented dough from scratch.",
  },
  {
    icon: Flame,
    title: "900°F Brick Oven",
    description:
      "Our imported Neapolitan brick ovens fire at 900°F, producing the signature smoky, crispy crust in just 90 seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Artificial Additives",
    description:
      "We never use preservatives, artificial colors, or flavor enhancers. What you taste is pure, honest food.",
  },
  {
    icon: Clock,
    title: "30-Minute Hot Delivery",
    description:
      "Our dedicated riders deliver piping-hot pizzas within 30 minutes — guaranteed fresh from oven to doorstep.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="pt-16">
        {/* ─── Hero Banner ─── */}
        <section className="relative py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold text-accent">
                <Heart className="h-3.5 w-3.5 fill-accent" />
                <span>Our Story</span>
              </div>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                About <span className="text-primary">Pizza House</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
                Born in Cairo with a passion for authentic Neapolitan wood-fired pizza. Every slice tells a story of tradition, quality, and love.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Story: Image + Text ─── */}
        <section className="py-16 md:py-24 bg-card/30 border-y border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center lg:gap-16">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative lg:col-span-6"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[36px] border border-border/60 shadow-2xl">
                  <Image
                    src="/images/hero-pizza.png"
                    alt="Pizza House wood-fired oven and artisan pizza crafting"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Experience Badge */}
                <div className="absolute -bottom-6 right-4 sm:right-8 z-20 flex items-center gap-3 rounded-3xl border border-white/10 bg-black/85 px-5 py-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">15+ Years</p>
                    <p className="text-xs text-zinc-400">Master Italian Crafting</p>
                  </div>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-5 lg:col-span-6"
              >
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Crafted With Passion, Baked to Perfection
                </h2>

                <p className="text-base leading-relaxed text-muted-foreground">
                  Pizza House was founded on a simple yet powerful mission: to bring the authentic taste of Neapolitan wood-fired pizza to Egypt. Our journey began when our head chef trained in Naples, mastering the art of slow-fermented dough, hand-stretched crusts, and brick-oven baking at 900°F.
                </p>

                <p className="text-base leading-relaxed text-muted-foreground">
                  Today, every pie is crafted with imported San Marzano tomatoes, 100% fresh buffalo mozzarella, and locally sourced organic vegetables — prepared fresh each morning. No shortcuts, no compromises.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Downtown Cairo, Egypt — Serving the finest artisan pizzas since 2010.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Milestone Statistics Strip ─── */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {MILESTONES.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-accent">
                      {stat.value}
                    </span>
                    <span className="mt-1 text-xs font-medium text-muted-foreground">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Our Values / Quality Ingredients ─── */}
        <section className="py-16 md:py-24 bg-card/30 border-y border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl text-center mb-12"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                Our Commitment
              </h2>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Quality You Can Taste
              </p>
              <p className="mt-4 text-base text-muted-foreground">
                Every ingredient is carefully selected and every recipe is perfected to deliver an unforgettable experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {VALUES.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group flex items-start gap-5 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/25">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to Taste the Difference?
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Explore our full menu and order your favorite artisan pizza today.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gap-2 font-bold shadow-lg shadow-primary/25 rounded-2xl h-12">
                  <Link href="/menu" className="flex items-center gap-2">
                    Explore Full Menu
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 font-semibold rounded-2xl h-12">
                  <Link href="/features" className="flex items-center gap-2">
                    See Our Features
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
