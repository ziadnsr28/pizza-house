/**
 * AdminCharts Component
 *
 * What it does:
 * Renders 3 charts using Recharts as requested by Task 6:
 * 1. Revenue Overview (Area / Line Chart)
 * 2. Orders Per Day (Bar Chart)
 * 3. Most Ordered Categories (Pie / Donut Chart)
 * Wrap in ResponsiveContainer and support theme dynamic colors.
 *
 * Where it belongs:
 * src/components/admin/AdminCharts.tsx
 */

"use client";

import { useSyncExternalStore } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, BarChart2, PieChart as PieIcon } from "lucide-react";
import {
  REVENUE_OVERVIEW_DATA,
  ORDERS_PER_DAY_DATA,
  MOST_ORDERED_CATEGORIES_DATA,
} from "@/constants/admin-data";
import { formatPrice } from "@/lib/utils";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function AdminCharts() {
  const isClient = useIsClient();

  if (!isClient) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-3xl border border-border/60 bg-card/60 p-6 animate-pulse lg:col-span-2" />
        <div className="h-72 rounded-3xl border border-border/60 bg-card/60 p-6 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Grid: Revenue Overview (2 Cols) & Categories Donut (1 Col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Overview Chart */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <span>Revenue Overview</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly revenue trajectory (Jan - Jul 2026)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              +22.5% Growth
            </span>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "currentColor" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  }}
                  formatter={(val: unknown) => [formatPrice(Number(val) || 0), "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Ordered Categories Donut Chart */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-border/40">
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <span>Popular Categories</span>
                <PieIcon className="h-4 w-4 text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Order share breakdown by category
              </p>
            </div>

            <div className="mt-2 h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOST_ORDERED_CATEGORIES_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {MOST_ORDERED_CATEGORIES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "1rem",
                    }}
                    formatter={(val: unknown) => [`${val}%`, "Share"]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Orders Per Day Bar Chart */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>Orders Per Day</span>
              <BarChart2 className="h-4 w-4 text-blue-500" />
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weekly distribution of completed order volumes
            </p>
          </div>
          <span className="text-xs font-bold text-foreground bg-muted/60 px-3 py-1 rounded-full">
            Peak: Weekend (Fri - Sat)
          </span>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ORDERS_PER_DAY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "currentColor" }} />
              <YAxis tick={{ fontSize: 11, fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "1rem",
                }}
                formatter={(val: unknown) => [`${val} orders`, "Volume"]}
              />
              <Bar dataKey="orders" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
