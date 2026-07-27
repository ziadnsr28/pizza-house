/**
 * QuickActions Component
 *
 * What it does:
 * Renders quick shortcut cards required by Task 5:
 * 1. Add Pizza
 * 2. Create Coupon
 * 3. Manage Orders
 * 4. View Reports
 *
 * Where it belongs:
 * src/components/admin/QuickActions.tsx
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Ticket, ShoppingBag, BarChart3, ArrowRight } from "lucide-react";
import { QUICK_ACTIONS_DATA, QuickActionItem } from "@/constants/admin-data";

const ICON_MAP = {
  PlusCircle,
  Ticket,
  ShoppingBag,
  BarChart3,
};

interface QuickActionsProps {
  actions?: QuickActionItem[];
}

export default function QuickActions({ actions = QUICK_ACTIONS_DATA }: QuickActionsProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl">
      <div className="pb-4 border-b border-border/40">
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">
          Quick Actions
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fast shortcuts for store operations & menu management
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const IconComponent = ICON_MAP[action.iconName] || PlusCircle;

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-5 backdrop-blur-md shadow-sm hover:shadow-xl transition-all ${action.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card border border-border/50 shadow-md group-hover:scale-110 transition-transform">
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    Action
                  </span>
                </div>

                <h3 className="mt-4 text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/30">
                <Link
                  href={action.href}
                  className="inline-flex items-center gap-2 text-xs font-bold text-foreground group-hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-1 py-0.5"
                >
                  <span>{action.btnText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
