/**
 * Admin Customers Route Page
 *
 * Where it belongs:
 * src/app/admin/customers/page.tsx
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ArrowLeft } from "lucide-react";
import RecentCustomers from "@/components/admin/RecentCustomers";

export default function AdminCustomersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1 flex items-center gap-2.5">
          <span>Customers Directory</span>
          <Users className="h-6 w-6 text-primary" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          View registered accounts, order histories, and contact info.
        </p>
      </div>

      <RecentCustomers />
    </motion.div>
  );
}
