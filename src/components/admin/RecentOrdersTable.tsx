/**
 * RecentOrdersTable Component
 *
 * What it does:
 * Renders recent orders table with required columns:
 * Order ID, Customer, Status, Payment, Date, Total, Actions.
 * Status badges: Pending, Preparing, Out For Delivery, Delivered, Cancelled.
 * Includes Framer Motion row animations and accessible focus states.
 *
 * Where it belongs:
 * src/components/admin/RecentOrdersTable.tsx
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { RECENT_ORDERS_DATA, AdminRecentOrder, OrderStatusType } from "@/constants/admin-data";
import { formatPrice } from "@/lib/utils";

const STATUS_CONFIG: Record<
  OrderStatusType,
  { label: string; className: string }
> = {
  Pending: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  Preparing: {
    label: "Preparing",
    className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  "Out For Delivery": {
    label: "Out For Delivery",
    className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  Delivered: {
    label: "Delivered",
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
};

interface RecentOrdersTableProps {
  orders?: AdminRecentOrder[];
}

export default function RecentOrdersTable({ orders = RECENT_ORDERS_DATA }: RecentOrdersTableProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-foreground">
            Recent Orders
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time customer transactions & fulfillment status
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-border/60 bg-muted/40 px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span>View All Orders</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm" aria-label="Recent Orders Table">
          <thead>
            <tr className="border-b border-border/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">Order ID</th>
              <th scope="col" className="py-3 px-4">Customer</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4">Payment</th>
              <th scope="col" className="py-3 px-4">Date</th>
              <th scope="col" className="py-3 px-4 text-right">Total</th>
              <th scope="col" className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/30">
            {orders.map((order, index) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;

              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/40 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-4 font-black text-foreground text-xs whitespace-nowrap">
                    {order.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-xs">{order.customerName}</span>
                      <span className="text-[10px] text-muted-foreground">{order.customerEmail}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusCfg.className}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-foreground">{order.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          order.paymentStatus === "Paid"
                            ? "text-emerald-500"
                            : order.paymentStatus === "Refunded"
                            ? "text-rose-500"
                            : "text-amber-500"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                    {order.date}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-black text-primary text-xs whitespace-nowrap">
                    {formatPrice(order.total)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/orders?id=${order.id}`}
                        aria-label={`View order details for ${order.id}`}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`More actions for order ${order.id}`}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
