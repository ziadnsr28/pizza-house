/**
 * Admin Orders Management Page Component
 *
 * What it does:
 * Renders all customer orders with status dropdown selectors to update live order status
 * (Pending, Preparing, Out for Delivery, Delivered).
 *
 * Where it belongs:
 * src/app/admin/orders/page.tsx (accessible at /admin/orders)
 */

"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useOrderStore } from "@/stores/order-store";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

const ORDER_STATUSES: Order["status"][] = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

export default function AdminOrdersPage() {
  const storeOrders = useOrderStore((state) => state.orders);
  const updateOrderStatusStore = useOrderStore((state) => state.updateOrderStatus);

  const [orders, setOrders] = useState<Order[]>(storeOrders);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    updateOrderStatusStore(orderId, newStatus);
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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

      {/* Orders Table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase bg-muted/20">
              <th className="py-3.5 px-4">Order Details</th>
              <th className="py-3.5 px-4">Customer Info</th>
              <th className="py-3.5 px-4">Total</th>
              <th className="py-3.5 px-4">Status Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-bold text-foreground block">{order.id}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground block mt-1">
                    {order.items.length} items ({order.items.map((i) => i.name).join(", ")})
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span className="font-semibold text-foreground block">
                    {order.customer.fullName}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {order.customer.phone}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    {order.customer.address}
                  </span>
                </td>

                <td className="py-4 px-4 font-bold text-accent">
                  {formatPrice(order.totalAmount)}
                </td>

                <td className="py-4 px-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as Order["status"])
                    }
                    className="rounded-xl border border-border/60 bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                  No orders recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
