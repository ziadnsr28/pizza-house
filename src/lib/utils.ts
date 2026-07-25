import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names without conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency Formatter Utility
 *
 * What it does:
 * Formats numeric price values into Egyptian Pounds (EGP) currency format
 * using the standard browser & Node Intl.NumberFormat API.
 *
 * Why it exists:
 * Ensures consistent, localization-ready currency display across all components
 * without hardcoding currency symbols inside UI components.
 *
 * Example:
 * formatPrice(220) => "EGP 220.00"
 *
 * @param price - The price number to format
 * @returns Formatted currency string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
