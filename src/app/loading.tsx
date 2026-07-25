/**
 * Global Page Loading Component
 *
 * What it does:
 * Renders a clean skeleton loading indicator during Next.js page transitions.
 *
 * Where it belongs:
 * src/app/loading.tsx
 */

import { Pizza } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary animate-bounce mb-4">
        <Pizza className="h-8 w-8 text-primary" />
      </div>
      <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
    </div>
  );
}
