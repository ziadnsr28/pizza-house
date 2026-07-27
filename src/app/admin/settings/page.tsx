/**
 * Admin Settings Route Page
 *
 * Where it belongs:
 * src/app/admin/settings/page.tsx
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
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
          <span>Store Settings</span>
          <Settings className="h-6 w-6 text-primary" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure business operating hours, delivery fees, and notifications.
        </p>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-md shadow-xl flex flex-col gap-6 max-w-2xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="store-name" className="text-xs font-bold text-foreground">Store Name</label>
          <input
            id="store-name"
            type="text"
            defaultValue="Pizza House Cairo"
            className="h-10 rounded-xl border border-border/60 bg-muted/40 px-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="delivery-fee" className="text-xs font-bold text-foreground">Standard Delivery Fee (EGP)</label>
          <input
            id="delivery-fee"
            type="number"
            defaultValue="25"
            className="h-10 rounded-xl border border-border/60 bg-muted/40 px-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="estimated-delivery-time" className="text-xs font-bold text-foreground">Estimated Delivery Time (Mins)</label>
          <input
            id="estimated-delivery-time"
            type="text"
            defaultValue="30-45 mins"
            className="h-10 rounded-xl border border-border/60 bg-muted/40 px-3.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <Button className="rounded-xl gap-2 font-bold self-start mt-2">
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>
    </motion.div>
  );
}
