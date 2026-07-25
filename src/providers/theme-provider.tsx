/**
 * ThemeProvider Component
 *
 * What it does:
 * Wraps next-themes ThemeProvider to provide client-side light/dark mode switching,
 * class attribute targeting, system preference detection, and local storage persistence.
 *
 * Why it exists:
 * Enables theme toggling without hydration mismatch across Next.js 15 App Router pages.
 *
 * Where it belongs:
 * src/providers/theme-provider.tsx
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
