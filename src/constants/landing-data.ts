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
  iconName: "Flame" | "Clock" | "Leaf" | "ChefHat" | "Award" | "Utensils";
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
  ingredients?: string[];
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
  { label: "Favorites", href: "/favorites" },
  { label: "My Orders", href: "/orders" },
  { label: "Features", href: "/features" },
  { label: "About Us", href: "/about" },
];

/** Menu Category Filter Tabs */
export const MENU_CATEGORIES: MenuCategory[] = [
  "All",
  "Classic",
  "Vegetarian",
  "Spicy",
  "Special",
];

/** Highlights / Features section data (6 Restaurant Features) */
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
  {
    id: "feature-4",
    iconName: "ChefHat",
    title: "Master Italian Chefs",
    description: "Handcrafted by experienced pizzaiolos trained in Naples traditional techniques.",
  },
  {
    id: "feature-5",
    iconName: "Award",
    title: "Premium Quality",
    description: "Award-winning 48-hour fermented dough crafted with zero artificial additives.",
  },
  {
    id: "feature-6",
    iconName: "Utensils",
    title: "Custom Toppings",
    description: "Personalize your pizza with a wide selection of artisan extra toppings and crusts.",
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
    isPopular: true,
  },
  {
    id: "pizza-6",
    name: "Chicken Ranch Pizza",
    description: "Grilled marinated chicken breast, smoky ranch sauce, mozzarella, and crispy bacon.",
    price: 265,
    image: "/images/hero-pizza.png",
    category: "Special",
    badge: "Customer Favorite",
    isPopular: true,
  },
];

/** Full Menu Pizza Dataset (9 Egyptian Market Varieties) */
export const FULL_MENU_PIZZAS: PizzaProduct[] = [
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
    isPopular: true,
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
    name: "Chicken Ranch Pizza",
    description: "Grilled marinated chicken breast, creamy garlic ranch sauce, mozzarella, and sweet corn.",
    price: 265,
    image: "/images/hero-pizza.png",
    category: "Special",
    badge: "Top Rated",
    isPopular: true,
  },
  {
    id: "pizza-7",
    name: "Mixed Meat Pizza (لحوم مشكل)",
    description: "Premium blend of minced beef, pepperoni, oriental sausage, turkey bacon, and melted cheddar.",
    price: 280,
    image: "/images/pizza-pepperoni.png",
    category: "Special",
    badge: "Meat Lovers",
  },
  {
    id: "pizza-8",
    name: "Egyptian Oriental Sausage (سجق)",
    description: "Authentic Egyptian oriental sausage, bell peppers, tomatoes, jalapenos, and melted mozzarella.",
    price: 250,
    image: "/images/pizza-spicy.png",
    category: "Spicy",
    badge: "Egyptian Local 🇪🇬",
  },
  {
    id: "pizza-9",
    name: "Seafood Supreme (سي فود)",
    description: "Fresh red sea shrimp, calamari rings, garlic butter sauce, mozzarella, and fresh parsley.",
    price: 310,
    image: "/images/pizza-truffle.png",
    category: "Special",
    badge: "Seafood Gourmet",
  },
];

/** Footer navigation link columns */
export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Full Menu", href: "/menu" },
      { label: "Features", href: "/features" },
      { label: "Favorites", href: "/favorites" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { label: "Track Your Order", href: "/orders" },
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
