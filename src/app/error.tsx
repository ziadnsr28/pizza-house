/**
 * Global Error Boundary Component
 *
 * What it does:
 * Renders a friendly error page when an uncaught runtime error occurs,
 * providing a Reset / Try Again button.
 *
 * Where it belongs:
 * src/app/error.tsx
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive shadow-inner mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Something Went Wrong
      </h1>

      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        We encountered an unexpected error. Please try refreshing or return to the homepage.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={reset} size="lg" className="gap-2 font-semibold shadow-md shadow-primary/20">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>

        <Button variant="outline" size="lg" className="gap-2 font-semibold">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
