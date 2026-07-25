/**
 * Root layout for the Pizza House application.
 * Wraps every page with global fonts (Poppins), global CSS, and ThemeProvider.
 */
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
