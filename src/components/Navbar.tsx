/**
 * Navbar Component
 *
 * What it does:
 * Renders fixed top navigation header for Pizza House featuring:
 * - Brand logo & Navigation links
 * - Theme toggle
 * - Favorites & Cart counters
 * - Auth.js Session status management (`useSession()` as single source of truth):
 *   - `loading`: renders skeleton loader
 *   - `authenticated`: renders User Avatar, Name, and Dropdown (Profile, Orders, Favorites, Admin, Logout)
 *   - `unauthenticated` / `null`: renders Login and Register buttons
 * - Mobile responsive drawer menu
 *
 * Where it belongs:
 * src/components/Navbar.tsx
 */

"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import {
  Pizza,
  Menu,
  X,
  ShoppingBag,
  Heart,
  User as UserIcon,
  LogIn,
  UserPlus,
  ListOrdered,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import ThemeToggle from "@/components/ThemeToggle";
import { NAV_ITEMS } from "@/constants/landing-data";
import { useCartStore } from "@/stores/cart-store";
import { useFavoriteStore } from "@/stores/favorite-store";
import { cn } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const isClient = useIsClient();

  // Auth.js Session - Single Source of Truth
  const { data: session, status } = useSession();

  // Shopping Cart & Favorites Stores
  const { getTotalItems, setCartOpen } = useCartStore();
  const totalCartItems = isClient ? getTotalItems() : 0;

  const getTotalFavorites = useFavoriteStore((state) => state.getTotalFavorites);
  const totalFavorites = isClient ? getTotalFavorites() : 0;

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const activeUser = session?.user
    ? {
        name: session.user.name || "Customer",
        email: session.user.email || "",
        image: session.user.image,
        role: session.user.role || "USER",
      }
    : null;

  const handleLogout = () => {
    nextAuthSignOut({ callbackUrl: "/" });
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
                  onClick={closeMobileMenu}
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

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
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

            {/* Cart Button */}
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

            {/* Auth Section: Loading / Authenticated Dropdown / Unauthenticated Buttons */}
            {status === "loading" || !isClient ? (
              <div className="flex h-10 w-24 items-center justify-center rounded-xl border border-border/40 bg-card/40 animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : isAuthenticated && activeUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className="flex h-10 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-muted/60"
                >
                  {activeUser.image ? (
                    <Image
                      src={activeUser.image}
                      alt={activeUser.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                      {activeUser.name[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate">{activeUser.name.split(" ")[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-border/40 mb-1">
                      <p className="text-xs font-bold text-foreground truncate">{activeUser.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{activeUser.email}</p>
                      {activeUser.role === "ADMIN" && (
                        <span className="inline-block mt-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-500">
                          ADMIN
                        </span>
                      )}
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-primary" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <ListOrdered className="h-3.5 w-3.5 text-primary" />
                      <span>Orders History</span>
                    </Link>

                    <Link
                      href="/favorites"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5 text-red-500" />
                      <span>Favorites</span>
                    </Link>

                    {activeUser.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-amber-500 hover:bg-amber-500/10 transition-colors"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <div className="border-t border-border/40 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full rounded-xl px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="gap-1.5 font-semibold rounded-xl text-xs">
                  <Link href="/login" className="flex items-center gap-1.5">
                    <LogIn className="h-3.5 w-3.5 text-primary" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 font-semibold rounded-xl text-xs">
                  <Link href="/register" className="flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5 text-accent" />
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Header Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

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
                    onClick={closeMobileMenu}
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

              <div className="mt-3 pt-4 border-t border-border/60 flex flex-col gap-3">
                {status === "loading" || !isClient ? (
                  <div className="flex h-10 w-full items-center justify-center rounded-lg border border-border/40 bg-card/40 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : isAuthenticated && activeUser ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/60 px-4 py-2.5 text-base font-semibold text-foreground"
                    >
                      <UserIcon className="h-5 w-5 text-primary" />
                      <span>Profile ({activeUser.name.split(" ")[0]})</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/60 px-4 py-2.5 text-base font-semibold text-foreground"
                    >
                      <ListOrdered className="h-5 w-5 text-primary" />
                      <span>Orders History</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-base font-semibold text-destructive"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card/60 py-2.5 text-sm font-semibold text-foreground"
                    >
                      <LogIn className="h-4 w-4 text-primary" />
                      <span>Login</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
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
