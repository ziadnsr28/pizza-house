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
 * Hydration note:
 * `next-themes` cannot determine the actual theme on the server — the server always
 * sees `theme = "system"` while the client may resolve it to "light" or "dark"
 * based on localStorage / OS preference. Reading `theme` before the component has
 * mounted causes a server ↔ client HTML mismatch (hydration warning).
 *
 * Fix: render a neutral placeholder button until `mounted === true`, then swap in
 * the real interactive button. This guarantees the server-rendered HTML and the
 * initial client render are identical, eliminating the mismatch.
 *
 * Where it belongs:
 * src/components/ThemeToggle.tsx
 */

"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * mounted tracks whether the component has completed its first client-side render.
   * We MUST NOT read `theme` before this is true — doing so causes hydration mismatch
   * because next-themes only knows the real theme after reading localStorage/OS prefs
   * on the client.
   */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

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

  /**
   * Before the component has mounted, render a visually-identical but inert placeholder.
   * This ensures the server HTML and the initial client render are byte-for-byte the same,
   * eliminating the hydration mismatch. The placeholder has the same dimensions so there
   * is zero layout shift when the real button swaps in.
   */
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        aria-label="Loading theme settings"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border-border/60 bg-card/60 backdrop-blur-sm"
      >
        {/* Static sun icon — matches the server-rendered markup exactly */}
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" aria-hidden="true" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  /** Derive the human-readable title only after mounting (safe to read `theme` here) */
  const themeTitle =
    theme === "dark" ? "Dark Mode" : theme === "light" ? "Light Mode" : "System Mode";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Trigger Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Toggle theme settings menu"
        title={themeTitle}
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
          <div className="flex flex-col gap-0.5" role="menu" aria-label="Theme options">

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
                <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span>Light</span>
              </div>
              {theme === "light" && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
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
                <Moon className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span>Dark</span>
              </div>
              {theme === "dark" && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
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
                <Laptop className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>System</span>
              </div>
              {theme === "system" && <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
