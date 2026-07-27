/**
 * Admin Orders Management Page Component
 *
 * What it does:
 * Renders all customer orders from PostgreSQL with real-time status update actions
 * (Pending, Preparing, Out For Delivery, Delivered, Cancelled).
 *
 * Where it belongs:
 * src/app/admin/orders/page.tsx (accessible at /admin/orders)
 */

"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export type OrderStatus = "Pending" | "Preparing" | "Out For Delivery" | "Delivered" | "Cancelled";

export interface DBOrderItem {
  id: string;
  pizzaId: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  toppings: string[];
  price: number;
}

export interface DBOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string | null;
  customerCity: string | null;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  totalAmount: number;
  createdAt: string;
  items: DBOrderItem[];
}

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          toast.error(data.error || "Failed to load orders");
        }
      })
      .catch(() => toast.error("Unable to connect to server"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        toast.error(data.error || "Failed to update order status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Live Operations</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Orders Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor incoming customer orders and update preparation status in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Orders Table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-sm" aria-label="Orders table">
          <thead>
            <tr className="border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase bg-muted/20">
              <th scope="col" className="py-3.5 px-4">Order Details</th>
              <th scope="col" className="py-3.5 px-4">Customer Info</th>
              <th scope="col" className="py-3.5 px-4">Payment</th>
              <th scope="col" className="py-3.5 px-4">Total</th>
              <th scope="col" className="py-3.5 px-4">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                  No orders recorded yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-foreground block">{order.id}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      {(() => {
                        const date = new Date(order.createdAt);
                        if (isNaN(date.getTime())) return "Invalid date";
                        return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
                      })()}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-1 line-clamp-2">
                      {order.items.length} items ({order.items.map((i) => i.name).join(", ")})
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-foreground block">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      {order.customerPhone} ({order.customerEmail})
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                      {order.customerAddress || "No address specified"}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-foreground block">{order.paymentMethod}</span>
                    <span
                      className={`inline-block mt-1 text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-primary text-base">
                    <div className="flex items-center min-w-0 overflow-hidden">
                      <span className="truncate" title={formatPrice(order.totalAmount)}>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="rounded-xl border border-border/60 bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
