/**
 * Admin Mock Data & Types
 *
 * What this file does:
 * Provides structured mock datasets for Admin Dashboard foundation (Stats, Orders, Customers, Charts, Quick Actions).
 *
 * Where it belongs:
 * src/constants/admin-data.ts
 */

export interface AdminStatCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down" | "neutral";
  changePercent: string;
  iconName: "ShoppingBag" | "DollarSign" | "Users" | "Pizza" | "Clock" | "CheckCircle2";
  badgeColor: string;
}

export type OrderStatusType = "Pending" | "Preparing" | "Out For Delivery" | "Delivered" | "Cancelled";

export interface AdminRecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  status: OrderStatusType;
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  date: string;
  total: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  iconName: "PlusCircle" | "Ticket" | "ShoppingBag" | "BarChart3";
  href: string;
  color: string;
  btnText: string;
}

export const ADMIN_STATS: AdminStatCard[] = [
  {
    id: "total-orders",
    title: "Total Orders",
    value: "1,248",
    subtitle: "vs. last month",
    trend: "up",
    changePercent: "+14.2%",
    iconName: "ShoppingBag",
    badgeColor: "text-primary bg-primary/10",
  },
  {
    id: "total-revenue",
    title: "Total Revenue",
    value: "EGP 342,850",
    subtitle: "vs. last month",
    trend: "up",
    changePercent: "+22.5%",
    iconName: "DollarSign",
    badgeColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "total-customers",
    title: "Total Customers",
    value: "856",
    subtitle: "vs. last month",
    trend: "up",
    changePercent: "+9.8%",
    iconName: "Users",
    badgeColor: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "total-pizzas",
    title: "Total Pizzas",
    value: "18",
    subtitle: "Active on menu",
    trend: "neutral",
    changePercent: "0%",
    iconName: "Pizza",
    badgeColor: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "pending-orders",
    title: "Pending Orders",
    value: "14",
    subtitle: "Needs processing",
    trend: "down",
    changePercent: "-3.1%",
    iconName: "Clock",
    badgeColor: "text-orange-500 bg-orange-500/10",
  },
  {
    id: "completed-orders",
    title: "Completed Orders",
    value: "1,180",
    subtitle: "94.5% completion rate",
    trend: "up",
    changePercent: "+16.3%",
    iconName: "CheckCircle2",
    badgeColor: "text-green-500 bg-green-500/10",
  },
];

export const RECENT_ORDERS_DATA: AdminRecentOrder[] = [
  {
    id: "ORD-9841",
    customerName: "Ahmed Hassan",
    customerEmail: "ahmed.hassan@example.com",
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    date: "2026-07-26 19:30",
    total: 490,
  },
  {
    id: "ORD-9840",
    customerName: "Sara Mahmoud",
    customerEmail: "sara.m@example.com",
    status: "Preparing",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    date: "2026-07-26 19:15",
    total: 360,
  },
  {
    id: "ORD-9839",
    customerName: "Mohamed Ali",
    customerEmail: "m.ali@example.com",
    status: "Out For Delivery",
    paymentMethod: "Vodafone Cash",
    paymentStatus: "Paid",
    date: "2026-07-26 18:50",
    total: 620,
  },
  {
    id: "ORD-9838",
    customerName: "Nour Ibrahim",
    customerEmail: "nour.ibrahim@example.com",
    status: "Delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    date: "2026-07-26 18:10",
    total: 280,
  },
  {
    id: "ORD-9837",
    customerName: "Tarek Youssef",
    customerEmail: "tarek.y@example.com",
    status: "Cancelled",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    date: "2026-07-26 17:45",
    total: 510,
  },
];

export const RECENT_CUSTOMERS_DATA: AdminCustomer[] = [
  {
    id: "CUST-001",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+20 100 123 4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    joinedDate: "12 Jul 2026",
    totalOrders: 8,
    totalSpent: 2450,
  },
  {
    id: "CUST-002",
    name: "Sara Mahmoud",
    email: "sara.m@example.com",
    phone: "+20 111 987 6543",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    joinedDate: "15 Jul 2026",
    totalOrders: 5,
    totalSpent: 1820,
  },
  {
    id: "CUST-003",
    name: "Mohamed Ali",
    email: "m.ali@example.com",
    phone: "+20 122 345 6789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed",
    joinedDate: "18 Jul 2026",
    totalOrders: 12,
    totalSpent: 4100,
  },
  {
    id: "CUST-004",
    name: "Nour Ibrahim",
    email: "nour.ibrahim@example.com",
    phone: "+20 106 555 4321",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nour",
    joinedDate: "21 Jul 2026",
    totalOrders: 3,
    totalSpent: 890,
  },
  {
    id: "CUST-005",
    name: "Omar Khaled",
    email: "omar.khaled@example.com",
    phone: "+20 155 777 8899",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
    joinedDate: "24 Jul 2026",
    totalOrders: 1,
    totalSpent: 350,
  },
];

export const QUICK_ACTIONS_DATA: QuickActionItem[] = [
  {
    id: "add-pizza",
    title: "Add Pizza",
    description: "Create a new pizza item with custom pricing & toppings.",
    iconName: "PlusCircle",
    href: "/admin/pizzas",
    color: "from-primary/20 to-primary/5 text-primary border-primary/20",
    btnText: "Add Item",
  },
  {
    id: "create-coupon",
    title: "Create Coupon",
    description: "Generate discount codes & promo offers for customers.",
    iconName: "Ticket",
    href: "/admin/coupons",
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20",
    btnText: "New Coupon",
  },
  {
    id: "manage-orders",
    title: "Manage Orders",
    description: "Update live delivery status & view customer addresses.",
    iconName: "ShoppingBag",
    href: "/admin/orders",
    color: "from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20",
    btnText: "View Orders",
  },
  {
    id: "view-reports",
    title: "View Reports",
    description: "Analyze sales analytics, popular pizzas, and revenue.",
    iconName: "BarChart3",
    href: "/admin/reviews",
    color: "from-purple-500/20 to-purple-500/5 text-purple-500 border-purple-500/20",
    btnText: "Explore Data",
  },
];

export const REVENUE_OVERVIEW_DATA = [
  { month: "Jan", revenue: 18500, orders: 320 },
  { month: "Feb", revenue: 22400, orders: 390 },
  { month: "Mar", revenue: 26800, orders: 440 },
  { month: "Apr", revenue: 31000, orders: 510 },
  { month: "May", revenue: 38900, orders: 630 },
  { month: "Jun", revenue: 45200, orders: 720 },
  { month: "Jul", revenue: 54100, orders: 850 },
];

export const ORDERS_PER_DAY_DATA = [
  { day: "Mon", orders: 42 },
  { day: "Tue", orders: 58 },
  { day: "Wed", orders: 65 },
  { day: "Thu", orders: 78 },
  { day: "Fri", orders: 120 },
  { day: "Sat", orders: 135 },
  { day: "Sun", orders: 95 },
];

export const MOST_ORDERED_CATEGORIES_DATA = [
  { name: "Classic", value: 40, color: "var(--primary)" },
  { name: "Special", value: 30, color: "#10b981" },
  { name: "Spicy", value: 18, color: "#f59e0b" },
  { name: "Vegetarian", value: 12, color: "#3b82f6" },
];
