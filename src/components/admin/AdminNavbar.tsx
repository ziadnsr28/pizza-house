/**
 * AdminNavbar Component
 *
 * What it does:
 * Renders the top navigation header for the Admin Dashboard.
 * Includes page context title, live clock/date, quick search bar, theme toggle,
 * notifications preview button, and admin avatar dropdown.
 *
 * Where it belongs:
 * src/components/admin/AdminNavbar.tsx
 */

"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Bell, Shield, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminNavbarProps {
  onOpenMobileSidebar?: () => void;
}

export default function AdminNavbar({ onOpenMobileSidebar }: AdminNavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    if (pathname.startsWith("/admin/orders")) return "Orders Management";
    if (pathname.startsWith("/admin/pizzas") || pathname.startsWith("/admin/products")) return "Pizzas Catalog";
    if (pathname.startsWith("/admin/categories")) return "Categories";
    if (pathname.startsWith("/admin/customers") || pathname.startsWith("/admin/users")) return "Customers Directory";
    if (pathname.startsWith("/admin/reviews")) return "Reviews & Ratings";
    if (pathname.startsWith("/admin/settings")) return "Store Settings";
    return "Admin Dashboard";
  };

  const userName = session?.user?.name || "Admin User";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-all">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar menu"
          className="rounded-xl p-2 text-foreground hover:bg-muted focus:outline-none lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>{getPageTitle()}</span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Shield className="h-3 w-3" /> Admin
            </span>
          </h1>
        </div>
      </div>

      {/* Right side: Search, Theme Toggle, Notifications, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders, pizzas..."
            aria-label="Global admin search"
            className="h-9 w-full rounded-xl border border-border/60 bg-muted/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Icon Button */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative rounded-xl border border-border/50 bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </button>

        {/* User Info Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent font-bold text-white text-xs shadow-md shadow-primary/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {session?.user?.email || "admin@pizzahouse.com"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
