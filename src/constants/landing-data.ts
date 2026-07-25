/**
 * Landing Page & Full Menu Data Constants
 *
 * What this file does:
 * Centralizes all static content used across the Pizza House application
 * (Landing page highlights, navigation links, and full pizza menu dataset).
 *
 * Why it exists:
 * Keeps UI components clean, reusable, and focused strictly on rendering.
 *
 * Where it belongs:
 * src/constants/landing-data.ts
 */

/** Category filter type definition */
export type MenuCategory = "All" | "Classic" | "Vegetarian" | "Spicy" | "Special";

/** TypeScript interface for Navigation Links */
export interface NavItem {
  label: string;
  href: string;
}

/** TypeScript interface for Feature Cards */
export interface FeatureItem {
  id: string;
  iconName: "Flame" | "Clock" | "Leaf";
  title: string;
  description: string;
}

/** TypeScript interface for Pizza Product Cards */
export interface PizzaProduct {
  id: string;
  name: string;
  description: string;
  price: number; // Stored as a pure number in EGP
  image: string;
  category: MenuCategory;
  badge?: string;
  isPopular?: boolean;
}

/** TypeScript interface for Footer Link Columns */
export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

/** TypeScript interface for Social Links */
export interface SocialLink {
  id: string;
  name: string;
  iconName: "Globe" | "Share2" | "MessageCircle";
  href: string;
}

/** Header navigation items */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Full Menu", href: "/menu" },
  { label: "Features", href: "/#features" },
  { label: "About Us", href: "/#about" },
];

/** Menu Category Filter Tabs */
export const MENU_CATEGORIES: MenuCategory[] = [
  "All",
  "Classic",
  "Vegetarian",
  "Spicy",
  "Special",
];

/** Highlights / Features section data */
export const FEATURES_DATA: FeatureItem[] = [
  {
    id: "feature-1",
    iconName: "Flame",
    title: "Wood-Fired Oven",
    description: "Baked at 900°F in authentic Italian brick ovens for a smoky, crispy crust.",
  },
  {
    id: "feature-2",
    iconName: "Leaf",
    title: "100% Fresh Ingredients",
    description: "Daily prepared organic veggies, San Marzano tomatoes, and fresh buffalo mozzarella.",
  },
  {
    id: "feature-3",
    iconName: "Clock",
    title: "30-Minute Delivery",
    description: "Piping hot delivery guaranteed within 30 minutes, right to your doorstep.",
  },
];

/** Popular preview pizzas featured on the landing page */
export const POPULAR_PIZZAS: PizzaProduct[] = [
  {
    id: "pizza-1",
    name: "Pepperoni Supreme",
    description: "Crispy artisan pepperoni, melted mozzarella, and signature tomato sauce.",
    price: 225,
    image: "/images/pizza-pepperoni.png",
    category: "Classic",
    badge: "Bestseller",
    isPopular: true,
  },
  {
    id: "pizza-2",
    name: "Classic Margherita",
    description: "San Marzano tomatoes, fresh mozzarella, extra virgin olive oil, and fresh basil.",
    price: 175,
    image: "/images/pizza-margherita.png",
    category: "Classic",
    badge: "Traditional",
  },
  {
    id: "pizza-3",
    name: "Truffle Mushroom",
    description: "Roasted wild mushrooms, creamy garlic white sauce, truffle oil, and fresh thyme.",
    price: 260,
    image: "/images/pizza-truffle.png",
    category: "Special",
    badge: "Chef Special",
  },
];

/** Full Menu Pizza Dataset */
export const FULL_MENU_PIZZAS: PizzaProduct[] = [
  ...POPULAR_PIZZAS,
  {
    id: "pizza-4",
    name: "Garden Veggie Delight",
    description: "Mediterranean organic bell peppers, kalamata olives, red onions, cherry tomatoes, and feta.",
    price: 195,
    image: "/images/pizza-veggie.png",
    category: "Vegetarian",
    badge: "Organic",
  },
  {
    id: "pizza-5",
    name: "Fiery Diablo Spicy",
    description: "Spicy pepperoni, fresh jalapeno slices, crushed red pepper, hot chili oil, and spicy tomato sauce.",
    price: 240,
    image: "/images/pizza-spicy.png",
    category: "Spicy",
    badge: "Spicy 🔥",
  },
  {
    id: "pizza-6",
    name: "Four Cheese Gourmet",
    description: "Blend of aged parmesan, creamy gorgonzola, fresh mozzarella, and ricotta with truffle oil.",
    price: 250,
    image: "/images/hero-pizza.png",
    category: "Special",
    badge: "Gourmet",
  },
];

/** Footer navigation link columns */
export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Our Story", href: "/#about" },
      { label: "Full Menu", href: "/menu" },
      { label: "Special Offers", href: "#" },
      { label: "Location & Hours", href: "#" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { label: "Track Your Order", href: "#" },
      { label: "Delivery Policy", href: "#" },
      { label: "FAQ & Contact", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

/** Social media links */
export const SOCIAL_LINKS: SocialLink[] = [
  { id: "social-1", name: "Website", iconName: "Globe", href: "#" },
  { id: "social-2", name: "Share", iconName: "Share2", href: "#" },
  { id: "social-3", name: "Community", iconName: "MessageCircle", href: "#" },
];
