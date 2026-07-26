/**
 * Root layout for the Pizza House application.
 * Wraps every page with global fonts (Poppins), global CSS, ThemeProvider,
 * SEO metadata, and Sonner Toast notifications.
 */

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "@/providers/SessionProvider";
import "./globals.css";

/**
 * Poppins font configuration.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

/** SEO metadata for the application */
export const metadata: Metadata = {
  title: {
    default: "Pizza House — Wood-Fired Artisan Pizza",
    template: "%s | Pizza House",
  },
  description:
    "Order handcrafted artisan wood-fired pizzas baked in 900°F brick ovens with fresh organic ingredients. Fast 30-minute hot delivery across Egypt.",
  keywords: [
    "Pizza",
    "Pizza House",
    "Wood-fired Pizza",
    "Artisan Pizza",
    "Pizza Delivery",
    "Egypt Pizza",
    "Fresh Ingredients",
  ],
  authors: [{ name: "Pizza House Team" }],
  creator: "Pizza House",
  metadataBase: new URL("https://pizzahouse.eg"),
  openGraph: {
    type: "website",
    locale: "en_EG",
    url: "https://pizzahouse.eg",
    title: "Pizza House — Wood-Fired Artisan Pizza",
    description:
      "Order handcrafted artisan wood-fired pizzas baked in 900°F brick ovens with fresh organic ingredients.",
    siteName: "Pizza House",
    images: [
      {
        url: "/images/hero-pizza.png",
        width: 1200,
        height: 630,
        alt: "Pizza House Artisan Wood-Fired Pizza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizza House — Wood-Fired Artisan Pizza",
    description: "Order handcrafted artisan wood-fired pizzas with fast 30-minute delivery.",
    images: ["/images/hero-pizza.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster position="top-right" richColors theme="system" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
