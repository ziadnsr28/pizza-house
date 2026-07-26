/**
 * MenuGrid Component
 *
 * What it does:
 * Renders a responsive grid of PizzaCard components (1 card per row on mobile,
 * 2 on tablet, 3 on desktop) with staggered Framer Motion entrance animations.
 *
 * Where it belongs:
 * src/components/MenuGrid.tsx
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import PizzaCard from "@/components/PizzaCard";
import EmptyState from "@/components/EmptyState";
import { PizzaProduct } from "@/constants/landing-data";

/** Component Props Interface */
export interface MenuGridProps {
  pizzas: PizzaProduct[];
  searchQuery: string;
  onReset: () => void;
}

/**
 * Framer Motion animation variants.
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function MenuGrid({ pizzas, searchQuery, onReset }: MenuGridProps) {
  /** If no pizzas match the filters, show the EmptyState component */
  if (pizzas.length === 0) {
    return <EmptyState searchQuery={searchQuery} onReset={onReset} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pizzas.map((p) => p.id).join(",")}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pizzas.map((pizza) => (
          <motion.div key={pizza.id} variants={itemVariants} className="w-full flex justify-center">
            <PizzaCard pizza={pizza} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
