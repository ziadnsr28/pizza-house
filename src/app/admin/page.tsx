/**
 * Admin Dashboard Main Page Component
 *
 * What it does:
 * Assembles all Sprint 16 foundation sections:
 * - Statistical Cards (Total Orders, Revenue, Customers, Pizzas, Pending, Completed)
 * - Quick Action Shortcut Cards
 * - Recharts Sales & Volume Analytics
 * - Recent Orders Table with Badges & Actions
 * - Recent Customers Directory Preview
 *
 * Where it belongs:
 * src/app/admin/page.tsx (accessible at /admin)
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminStatCards from "@/components/admin/AdminStatCards";
import QuickActions from "@/components/admin/QuickActions";
import AdminCharts from "@/components/admin/AdminCharts";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import RecentCustomers from "@/components/admin/RecentCustomers";
import { ADMIN_STATS, AdminCustomer, AdminRecentOrder, AdminStatCard } from "@/constants/admin-data";
import { formatPrice } from "@/lib/utils";

type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalPizzas: number;
  pendingOrders: number;
  completedOrders: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<AdminRecentOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((response) => response.json()),
      fetch("/api/orders?limit=5").then((response) => response.json()),
      fetch("/api/admin/customers?limit=5").then((response) => response.json()),
    ])
      .then(([statsResult, ordersResult, customersResult]) => {
        if (statsResult.success) setStats(statsResult.stats);
        if (ordersResult.success) {
          setOrders((ordersResult.orders || []).map((order: { id: string; customerName: string; customerEmail: string; status: AdminRecentOrder["status"]; paymentMethod: string; paymentStatus: AdminRecentOrder["paymentStatus"]; total: number; createdAt: string }) => ({
            id: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            date: new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
            total: order.total,
          })));
        }
        if (customersResult.success) {
          setCustomers((customersResult.customers || []).map((customer: { id: string; name: string; email: string; phone: string; image: string | null; createdAt: string; ordersCount: number; totalSpent: number }) => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            avatar: customer.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer.email)}`,
            joinedDate: new Date(customer.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            totalOrders: customer.ordersCount,
            totalSpent: customer.totalSpent,
          })));
        }
      })
      .catch(() => undefined);
  }, []);

  const statValues: Record<string, string> = {
    "total-orders": stats ? stats.totalOrders.toLocaleString() : "—",
    "total-revenue": stats ? formatPrice(stats.totalRevenue) : "—",
    "total-customers": stats ? stats.totalCustomers.toLocaleString() : "—",
    "total-pizzas": stats ? stats.totalPizzas.toLocaleString() : "—",
    "pending-orders": stats ? stats.pendingOrders.toLocaleString() : "—",
    "completed-orders": stats ? stats.completedOrders.toLocaleString() : "—",
  };
  const statCards: AdminStatCard[] = ADMIN_STATS.map((stat) => ({ ...stat, value: statValues[stat.id] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 pb-12"
    >
      {/* 1. Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Overview of store performance, customer orders, and key metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto mt-2 sm:mt-0">
          <span className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live & Operational
          </span>
        </div>
      </div>

      {/* 2. Task 2: Statistical Summary Cards */}
      <section aria-label="Statistics Summary">
        <AdminStatCards customStats={statCards} />
      </section>

      {/* 3. Task 5: Quick Actions */}
      <section aria-label="Quick Actions Shortcuts">
        <QuickActions />
      </section>

      {/* 4. Task 6: Recharts Analytics */}
      <section aria-label="Sales and Orders Analytics">
        <AdminCharts />
      </section>

      {/* 5. Task 3 & Task 4: Recent Orders & Recent Customers */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Orders Table (2 Cols) */}
        <section aria-label="Recent Orders Table" className="lg:col-span-2">
          <RecentOrdersTable orders={orders} />
        </section>

        {/* Recent Customers Directory (1 Col) */}
        <section aria-label="Recent Customers Directory">
          <RecentCustomers customers={customers} />
        </section>
      </div>
    </motion.div>
  );
}
