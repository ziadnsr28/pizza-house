/**
 * Admin Dashboard Home Page Component
 *
 * What it does:
 * Renders statistical summary cards (Total Orders, Total Revenue, Total Users, Total Products)
 * and a recent orders preview table with Framer Motion entrance animations.
 *
 * Where it belongs:
 * src/app/admin/page.tsx (accessible at /admin)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Users, Pizza, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { FULL_MENU_PIZZAS } from "@/constants/landing-data";
import { useOrderStore } from "@/stores/order-store";

export default function AdminDashboardPage() {
  const orders = useOrderStore((state) => state.orders);

  const [stats, setStats] = useState({
    totalOrders: orders.length || 24,
    totalRevenue: orders.reduce((acc, curr) => acc + curr.totalAmount, 0) || 5840,
    totalUsers: 142,
    totalProducts: FULL_MENU_PIZZAS.length,
  });

  useEffect(() => {
    // Attempt fetching live counts from backend APIs
    Promise.all([
      fetch("/api/orders").then((res) => res.json()).catch(() => null),
      fetch("/api/pizzas").then((res) => res.json()).catch(() => null),
    ]).then(([ordersData, pizzasData]) => {
      if (ordersData?.orders && Array.isArray(ordersData.orders) && ordersData.orders.length > 0) {
        const fetchedOrders = ordersData.orders;
        setStats((prev) => ({
          ...prev,
          totalOrders: fetchedOrders.length,
          totalRevenue: fetchedOrders.reduce((sum: number, o: { total?: number }) => sum + (o.total || 0), 0) || prev.totalRevenue,
        }));
      }
      if (pizzasData?.pizzas && Array.isArray(pizzasData.pizzas)) {
        setStats((prev) => ({ ...prev, totalProducts: pizzasData.pizzas.length }));
      }
    });
  }, []);

  const STAT_CARDS = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      subtitle: "+18.4% from last month",
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      subtitle: "+12 new orders today",
      icon: ShoppingBag,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Total Customers",
      value: stats.totalUsers.toString(),
      subtitle: "+8 registered this week",
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toString(),
      subtitle: "Full menu varieties",
      icon: Pizza,
      color: "text-accent bg-accent/15",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here is what is happening at Pizza House today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2 font-semibold rounded-xl">
            <Link href="/admin/products" className="flex items-center gap-1.5">
              Manage Products
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{stat.title}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </span>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{stat.subtitle}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders Preview Table */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
            <p className="text-xs text-muted-foreground">Latest transactions across Pizza House</p>
          </div>

          <Button variant="outline" size="sm" className="font-semibold rounded-xl">
            <Link href="/admin/orders">View All Orders</Link>
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 text-xs text-muted-foreground uppercase">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">{order.id}</td>
                  <td className="py-3 px-4 text-muted-foreground">{order.customer.fullName}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-accent">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
