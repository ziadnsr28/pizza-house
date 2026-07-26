/**
 * SessionProvider Component
 *
 * What it does:
 * Wraps NextAuth SessionProvider for client components.
 *
 * Where it belongs:
 * src/providers/SessionProvider.tsx
 */

"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
