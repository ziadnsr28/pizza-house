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
 * - Mobile hamburger menu auto-closing on selection
 * - Order CTA button linking directly to /menu
 *
 * Why it exists:
 * Provides persistent global navigation across all devices.
 *
 * Where it belongs:
 * src/components/Navbar.tsx
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pizza, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/constants/landing-data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  /** Current URL pathname from Next.js router */
  const pathname = usePathname();

  /** State tracking if mobile drawer menu is open */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** State tracking current active section anchor on home page */
  const [activeSection, setActiveSection] = useState("#hero");

  /** State tracking if page is scrolled down to toggle shadow */
  const [isScrolled, setIsScrolled] = useState(false);

  /** Toggle mobile drawer menu */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  /** Close mobile drawer menu when link is clicked */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /** Handle link click */
  const handleNavClick = (href: string) => {
    if (href.startsWith("#") || href.includes("#")) {
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : href;
      setActiveSection(hash);
    }
    closeMobileMenu();
  };

  /** Scroll listener for shadow and section observer on home page */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    if (pathname === "/") {
      const sectionIds = ["hero", "features", "about", "menu"];
      const observerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
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
            const isActive =
              pathname === item.href ||
              (pathname === "/" && item.href.startsWith("/#") && activeSection === item.href.replace("/", "")) ||
              (pathname === "/" && item.href === "/" && activeSection === "#hero");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  "group relative py-1 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}

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

        {/* Desktop CTA Button linking to /menu */}
        <div className="hidden items-center gap-3 md:flex">
          <Button size="sm" className="gap-2 font-semibold shadow-md shadow-primary/20">
            <Link href="/menu" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Order Now
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden">
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
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}

            <div className="mt-3 pt-4 border-t border-border/60">
              <Button
                onClick={closeMobileMenu}
                className="w-full gap-2 font-semibold shadow-md shadow-primary/20"
              >
                <Link href="/menu" className="flex items-center justify-center gap-2 w-full">
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
