/**
 * Home page for the Pizza House application.
 * This is a temporary placeholder that will be replaced
 * with the real landing page in a future sprint.
 */

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
      {/* Hero heading */}
      <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
        🍕 Pizza House
      </h1>

      {/* Tagline */}
      <p className="max-w-md text-center text-lg text-muted-foreground">
        Fresh, handmade pizza with the finest ingredients. Coming soon.
      </p>

      {/* CTA button — tests that shadcn/ui and our theme work */}
      <Button size="lg">Order Now</Button>
    </main>
  );
}
