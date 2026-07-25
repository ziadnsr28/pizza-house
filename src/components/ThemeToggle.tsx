/**
 * ThemeToggle Component
 *
 * What it does:
 * Renders an enhanced, accessible theme toggle button with:
 * - Smooth Sun / Moon icon rotation animations
 * - Hover scale effect
 * - Compact dropdown menu to choose Light, Dark, or System mode
 * - Active theme highlight indicator
 *
 * Why it exists:
 * Provides users with complete theme preference control (Light, Dark, System)
 * in a compact, responsive navbar component.
 *
 * Where it belongs:
 * src/components/ThemeToggle.tsx
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /** Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Trigger Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle theme settings menu"
        title={theme === "dark" ? "Dark Mode" : theme === "light" ? "Light Mode" : "System Mode"}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {/* Sun Icon (Rotates out in Dark mode) */}
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />

        {/* Moon Icon (Rotates in in Dark mode) */}
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-400" />

        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 z-50">
          <div className="flex flex-col gap-0.5" role="menu">
            
            {/* ☀️ Light Mode Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                theme === "light"
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-muted/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light</span>
              </div>
              {theme === "light" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>

            {/* 🌙 Dark Mode Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                theme === "dark"
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-muted/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-blue-400" />
                <span>Dark</span>
              </div>
              {theme === "dark" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>

            {/* 💻 System Mode Option */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                theme === "system"
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-muted/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-muted-foreground" />
                <span>System</span>
              </div>
              {theme === "system" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
