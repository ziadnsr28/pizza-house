/**
 * Home Page (Pizza House Landing Page)
 *
 * What it does:
 * Assembles all landing page components into a complete responsive page layout.
 * Page content begins with top padding (pt-16) to ensure zero overlap with the fixed header.
 *
 * Components assembled:
 * 1. Navbar (Fixed top-0 left-0 right-0 header navigation with scroll shadow)
 * 2. HeroSection (Artisan pizza hero banner & CTAs)
 * 3. FeaturesSection (6 feature highlights in a responsive grid)
 * 4. AboutSection (Restaurant story, quality message, experience badge)
 * 5. PopularPizzaSection (Preview of popular pizza menu cards)
 * 6. Footer (Links, contact info, social icons, and copyright)
 *
 * Where it belongs:
 * src/app/page.tsx
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import PopularPizzaSection from "@/components/PopularPizzaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* 1. Fixed Header Navigation */}
      <Navbar />

      {/* 2. Main Landing Sections (pt-16 ensures content starts cleanly below 64px fixed header) */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Features / Value Proposition Highlights */}
        <FeaturesSection />

        {/* About Us / Restaurant Story */}
        <AboutSection />

        {/* Popular Pizza Cards Grid */}
        <PopularPizzaSection />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
