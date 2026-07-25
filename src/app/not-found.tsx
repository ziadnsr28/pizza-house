/**
 * Custom 404 Not Found Page Component
 *
 * What it does:
 * Renders a clean 404 error screen when a customer navigates to a non-existent URL.
 *
 * Where it belongs:
 * src/app/not-found.tsx
 */

import Link from "next/link";
import { Pizza, Home, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner mb-6">
        <Pizza className="h-10 w-10 text-primary animate-pulse" />
      </div>

      <span className="rounded-full bg-accent/15 px-4 py-1 text-xs font-bold text-accent mb-3">
        404 — Page Not Found
      </span>

      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Lost in the Kitchen?
      </h1>

      <p className="mt-4 max-w-md text-base text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to the menu!
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Button size="lg" className="gap-2 font-bold shadow-lg shadow-primary/25 rounded-2xl">
          <Link href="/menu" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Explore Full Menu
          </Link>
        </Button>

        <Button variant="outline" size="lg" className="gap-2 font-semibold rounded-2xl">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
