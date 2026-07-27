/**
 * AdminStatCards Component
 *
 * What it does:
 * Renders 6 statistical summary cards required by Task 2:
 * 1. Total Orders
 * 2. Total Revenue
 * 3. Total Customers
 * 4. Total Pizzas
 * 5. Pending Orders
 * 6. Completed Orders
 * Includes Lucide icons, trend badges, subtle Framer Motion entrance & hover scale.
 *
 * Where it belongs:
 * src/components/admin/AdminStatCards.tsx
 */

"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Pizza,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";
import { ADMIN_STATS, AdminStatCard } from "@/constants/admin-data";

const ICON_MAP = {
  ShoppingBag,
  DollarSign,
  Users,
  Pizza,
  Clock,
  CheckCircle2,
};

interface AdminStatCardsProps {
  customStats?: AdminStatCard[];
}

export default function AdminStatCards({ customStats }: AdminStatCardsProps) {
  const statsList = customStats || ADMIN_STATS;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsList.map((stat, i) => {
        const IconComponent = ICON_MAP[stat.iconName] || ShoppingBag;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group relative flex flex-col justify-between rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-primary/30 transition-all"
          >
            {/* Header: Title & Icon */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-muted-foreground tracking-tight">
                {stat.title}
              </span>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${stat.badgeColor} transition-transform group-hover:scale-110`}
              >
                <IconComponent className="h-5 w-5" />
              </div>
            </div>

            {/* Value & Subtitle */}
            <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden">
              <Tooltip content={String(stat.value)}>
                <span
                  className="flex-1 min-w-0 truncate text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-foreground"
                  title={String(stat.value)}
                >
                  {stat.value}
                </span>
              </Tooltip>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              {stat.trend === "up" && (
                <span className="inline-flex items-center text-emerald-500 font-bold">
                  <TrendingUp className="mr-0.5 h-3 w-3" />
                  {stat.changePercent}
                </span>
              )}
              {stat.trend === "down" && (
                <span className="inline-flex items-center text-rose-500 font-bold">
                  <TrendingDown className="mr-0.5 h-3 w-3" />
                  {stat.changePercent}
                </span>
              )}
              {stat.trend === "neutral" && (
                <span className="inline-flex items-center text-amber-500 font-bold">
                  <Minus className="mr-0.5 h-3 w-3" />
                  {stat.changePercent}
                </span>
              )}
              <span className="truncate">{stat.subtitle}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
