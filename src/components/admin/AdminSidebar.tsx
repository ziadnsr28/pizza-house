/**
 * AdminSidebar Component
 *
 * What it does:
 * Renders the responsive administration sidebar navigation menu with active route styling,
 * mobile drawer toggle, and links to Dashboard, Products, Orders, Users, Reviews, and Main Site.
 *
 * Where it belongs:
 * src/components/admin/AdminSidebar.tsx
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pizza,
  ShoppingBag,
  Users,
  MessageSquare,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Pizza },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Header Toggle Bar */}
      <div className="flex h-16 w-full items-center justify-between border-b border-border/60 bg-card/90 px-4 backdrop-blur-md lg:hidden sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <span>Pizza House Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle admin menu"
            className="rounded-lg p-2 text-foreground hover:bg-muted focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container (Fixed desktop, Drawer mobile) */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-border/60 bg-card/95 p-6 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-8">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              onClick={closeSidebar}
              className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-foreground"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Pizza className="h-5 w-5 text-white" />
              </div>
              <span>
                Admin <span className="text-primary">Panel</span>
              </span>
            </Link>

            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-bold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Shortcut to Main Site */}
        <div className="pt-6 border-t border-border/40">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Main Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
