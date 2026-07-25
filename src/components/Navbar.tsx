/**
 * Navbar Component
 *
 * What it does:
 * Renders a fixed top navigation header for Pizza House featuring:
 * - Fixed positioning (`fixed top-0 left-0 right-0 z-50`)
 * - Dynamic scroll shadow (`isScrolled` state triggers subtle shadow upon scrolling)
 * - Pathname detection (`usePathname`) for active route highlighting (/ vs /menu)
 * - Active section tracking with animated underline transitions
 * - Smooth hover underline animation
 * - Favorites & Cart counter badges connected to Zustand
 * - ThemeToggle button (Light / Dark mode toggle)
 * - CartDrawer toggle & mobile drawer menu
 *
 * Where it belongs:
 * src/components/Navbar.tsx
 */

"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza, Menu, X, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import ThemeToggle from "@/components/ThemeToggle";
import { NAV_ITEMS } from "@/constants/landing-data";
import { useCartStore } from "@/stores/cart-store";
import { useFavoriteStore } from "@/stores/favorite-store";
import { cn } from "@/lib/utils";

/** Helper to subscribe to client mount state safely without React 19 useEffect warnings */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Navbar() {
  /** Current URL pathname from Next.js router */
  const pathname = usePathname();

  /** State tracking if mobile drawer menu is open */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** State tracking if page is scrolled down to toggle shadow */
  const [isScrolled, setIsScrolled] = useState(false);

  /** Safe client hydration check */
  const isClient = useIsClient();

  /** Zustand cart & favorite store getters */
  const { getTotalItems, setCartOpen } = useCartStore();
  const totalCartItems = isClient ? getTotalItems() : 0;

  const getTotalFavorites = useFavoriteStore((state) => state.getTotalFavorites);
  const totalFavorites = isClient ? getTotalFavorites() : 0;

  /** Toggle mobile drawer menu */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  /** Close mobile drawer menu when link is clicked */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /** Handle link click — close mobile drawer */
  const handleNavClick = () => {
    closeMobileMenu();
  };

  /** Scroll listener for shadow */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-border/60 bg-background/85 backdrop-blur-md shadow-lg shadow-black/30"
            : "border-b border-border/30 bg-background/70 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <Pizza className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground">
              Pizza <span className="text-primary">House</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "group relative flex items-center gap-1.5 py-1 text-sm font-medium transition-colors duration-200",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{item.label}</span>

                  {item.href === "/favorites" && totalFavorites > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {totalFavorites}
                    </span>
                  )}

                  {/* Animated Underline */}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions: Theme Toggle, Cart Button & Order Link */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Favorites Icon Button */}
            <Link
              href="/favorites"
              aria-label={`Favorites (${totalFavorites} items)`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-foreground backdrop-blur-sm transition-all hover:border-red-500/50 hover:bg-muted/60"
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500/30" />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Live Cart Button with Item Counter Badge */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open Cart (${totalCartItems} items)`}
              className="relative flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted/60"
            >
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-primary-foreground animate-in zoom-in-50 duration-200">
                  {totalCartItems}
                </span>
              )}
            </button>

            <Button size="sm" className="gap-2 font-semibold shadow-md shadow-primary/20">
              <Link href="/menu" className="flex items-center gap-2">
                Explore Menu
              </Link>
            </Button>
          </div>

          {/* Mobile Actions: Theme Toggle, Cart Icon & Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Favorites Button */}
            <Link
              href="/favorites"
              aria-label={`Favorites (${totalFavorites} items)`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-foreground backdrop-blur-sm"
            >
              <Heart className="h-5 w-5 text-red-500 fill-red-500/30" />
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Mobile Cart Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open Cart (${totalCartItems} items)`}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-card/60 text-foreground backdrop-blur-sm"
            >
              <ShoppingBag className="h-5 w-5 text-primary" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-primary-foreground">
                  {totalCartItems}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="animate-in slide-in-from-top-2 duration-200 border-b border-border bg-card/95 px-4 py-6 shadow-xl backdrop-blur-lg md:hidden">
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-2.5 text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.href === "/favorites" && totalFavorites > 0 ? (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {totalFavorites}
                      </span>
                    ) : isActive ? (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    ) : null}
                  </Link>
                );
              })}

              <div className="mt-3 pt-4 border-t border-border/60">
                <Button
                  onClick={closeMobileMenu}
                  className="w-full gap-2 font-semibold shadow-md shadow-primary/20"
                >
                  <Link href="/menu" className="flex items-center justify-center gap-2 w-full">
                    Explore Menu
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
}
