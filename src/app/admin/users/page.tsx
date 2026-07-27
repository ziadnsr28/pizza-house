/**
 * Admin Users Management Page Component
 *
 * What it does:
 * Displays registered customer accounts from PostgreSQL with contact information,
 * role badge (ADMIN/USER), order count, and total spent.
 *
 * Where it belongs:
 * src/app/admin/users/page.tsx (accessible at /admin/users)
 */

"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Phone, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: "USER" | "ADMIN";
  image: string | null;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/customers?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.customers)) {
          setUsers(data.customers);
        } else {
          toast.error(data.error || "Failed to load users");
        }
      })
      .catch(() => toast.error("Unable to connect to server"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <Users className="h-3.5 w-3.5" />
            <span>Customer Accounts</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Registered Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View registered customer accounts, roles, total spent, and order activity.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-all shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-sm" aria-label="Users table">
          <thead>
            <tr className="border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase bg-muted/20">
              <th scope="col" className="py-3.5 px-4">User</th>
              <th scope="col" className="py-3.5 px-4">Contact Info</th>
              <th scope="col" className="py-3.5 px-4">Role</th>
              <th scope="col" className="py-3.5 px-4 text-right">Orders Placed</th>
              <th scope="col" className="py-3.5 px-4 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                  No registered users found.
                </td>
              </tr>
            ) : (
              users.map((usr) => (
                <tr key={usr.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-foreground block">{usr.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(usr.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      {usr.email}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Phone className="h-3.5 w-3.5" />
                      {usr.phone || "N/A"}
                    </span>
                    {usr.address && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        {usr.address}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        usr.role === "ADMIN"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {usr.role === "ADMIN" ? "Administrator" : "Customer"}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-extrabold text-foreground">
                    {usr.ordersCount} orders
                  </td>

                  <td className="py-4 px-4 text-right font-black text-primary">
                    {formatPrice(usr.totalSpent)}
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
