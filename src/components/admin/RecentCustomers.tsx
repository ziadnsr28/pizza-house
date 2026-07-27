/**
 * RecentCustomers Component
 *
 * What it does:
 * Renders recent customer accounts with:
 * Avatar, Name, Email, Phone, Joined Date, Total Orders, Total Spent.
 * Responsive list / card format.
 *
 * Where it belongs:
 * src/components/admin/RecentCustomers.tsx
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Calendar, ArrowUpRight, UserCheck } from "lucide-react";
import { AdminCustomer } from "@/constants/admin-data";
import { formatPrice } from "@/lib/utils";

interface RecentCustomersProps {
  customers?: AdminCustomer[];
}

export default function RecentCustomers({ customers }: RecentCustomersProps) {
  const [liveCustomers, setLiveCustomers] = useState<AdminCustomer[]>([]);
  const displayCustomers = customers ?? liveCustomers;

  useEffect(() => {
    if (customers) return;

    fetch("/api/admin/customers?limit=10")
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) return;
        setLiveCustomers((result.customers || []).map((customer: { id: string; name: string; email: string; phone: string; image: string | null; createdAt: string; ordersCount: number; totalSpent: number }) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          avatar: customer.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customer.email)}`,
          joinedDate: new Date(customer.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          totalOrders: customer.ordersCount,
          totalSpent: customer.totalSpent,
        })));
      })
      .catch(() => undefined);
  }, [customers]);

  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>Recent Customers</span>
              <UserCheck className="h-4 w-4 text-primary" />
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Newly registered users and frequent pizza lovers
            </p>
          </div>

          <Link
            href="/admin/customers"
            aria-label="View all customer accounts"
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Customer List */}
        <div className="mt-4 flex flex-col gap-3">
          {displayCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-muted/30 p-3 hover:bg-muted/60 transition-all group"
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/20 bg-primary/10">
                  <Image
                    src={customer.avatar}
                    alt={customer.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {customer.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">
                    {customer.email}
                  </span>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Phone className="h-2.5 w-2.5" />
                      {customer.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-2.5 w-2.5" />
                      {customer.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Spent & Orders summary */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-black text-primary">
                  {formatPrice(customer.totalSpent)}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {customer.totalOrders} orders
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-border/30 text-center">
        <Link
          href="/admin/customers"
          className="text-xs font-bold text-primary hover:underline"
        >
          View Full Customer Directory ({displayCustomers.length}) →
        </Link>
      </div>
    </div>
  );
}
