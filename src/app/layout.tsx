/**
 * Root layout for the Pizza House application.
 * This file wraps every page with the global font (Poppins),
 * global styles, and the dark theme class.
 */
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/**
 * Poppins font configuration.
 * Poppins is NOT a variable font, so we must specify each weight we need.
 * - 400: Regular text
 * - 500: Medium (buttons, labels)
 * - 600: Semi-bold (headings, emphasis)
 * - 700: Bold (main headings)
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

/** SEO metadata for the application */
export const metadata: Metadata = {
  title: "Pizza House — Fresh, Handmade Pizza",
  description:
    "Order the best handmade pizzas with fresh ingredients. Fast delivery, amazing taste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
