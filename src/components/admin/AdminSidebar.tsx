/**
 * Updated AdminSidebar Component
 *
 * What it does:
 * Sidebar containing all 7 required navigation items:
 * Dashboard, Orders, Pizzas, Categories, Customers, Reviews, Settings.
 * Supports collapse on mobile, active route highlight, Framer Motion transitions, Lucide icons.
 *
 * Where it belongs:
 * src/components/admin/AdminSidebar.tsx
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Pizza,
  FolderTree,
  Users,
  Ticket,
  MessageSquare,
  Settings,
  ArrowLeft,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

export const ADMIN_SIDEBAR_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Pizzas", href: "/admin/pizzas", icon: Pizza },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border/60 bg-card/95 p-5 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-foreground group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                <Pizza className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold leading-none">
                  Pizza <span className="text-primary">House</span>
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Admin Panel
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-px w-full bg-border/40" />

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Main Menu
            </span>
            {ADMIN_SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 h-2 w-2 rounded-full bg-white"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground font-medium">Theme Mode</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Customer Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
