/**
 * Footer Component
 *
 * What it does:
 * Renders the bottom footer for Pizza House.
 * Displays brand story, quick navigation link columns, store address,
 * social media profile buttons, and copyright details.
 *
 * Why it exists:
 * Provides essential contact info, legal links, and navigation options at the bottom of the page.
 *
 * Where it belongs:
 * src/components/Footer.tsx
 */

import Link from "next/link";
import { Pizza, Phone, MapPin, Globe, Share2, MessageCircle } from "lucide-react";
import { FOOTER_LINK_GROUPS, SOCIAL_LINKS } from "@/constants/landing-data";

/** Map social icon strings to Lucide components */
const SOCIAL_ICON_MAP = {
  Globe: Globe,
  Share2: Share2,
  MessageCircle: MessageCircle,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-card/40 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Layout (Grid: 1 col on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Pizza className="h-5 w-5 text-white" />
              </div>
              <span className="text-foreground">
                Pizza <span className="text-primary">House</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Authentic wood-fired artisan pizza made with passion, 48-hour fermented dough, and organic ingredients.
            </p>

            {/* Quick Contact Specs */}
            <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>124 Little Italy Way, Brooklyn, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+1 (555) 839-2019</span>
              </div>
            </div>
          </div>

          {/* Dynamic Link Groups Columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Social Media & Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Follow & Visit Us
            </h3>
            <p className="text-sm text-muted-foreground">
              Open Daily: 11:00 AM – 11:00 PM
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => {
                const IconComp = SOCIAL_ICON_MAP[social.iconName];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <IconComp className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {currentYear} Pizza House. All rights reserved.</p>
          <p className="text-muted-foreground/80">
            Crafted with ❤️ for pizza lovers everywhere.
          </p>
        </div>

      </div>
    </footer>
  );
}
