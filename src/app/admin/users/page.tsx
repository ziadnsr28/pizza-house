/**
 * Admin Users Management Page Component
 *
 * What it does:
 * Displays registered customer accounts, contact information, order count, and member roles.
 *
 * Where it belongs:
 * src/app/admin/users/page.tsx (accessible at /admin/users)
 */

"use client";

import { useState } from "react";
import { Users, Mail, Phone, MapPin } from "lucide-react";
import { User } from "@/types/user";

const MOCK_USERS: (User & { ordersCount: number })[] = [
  {
    id: "usr-101",
    fullName: "Alex Morgan",
    email: "alex@pizzahouse.eg",
    phone: "01012345678",
    address: "Building 12, Road 9, Maadi, Cairo",
    role: "admin",
    createdAt: "2026-01-15T10:00:00Z",
    ordersCount: 8,
  },
  {
    id: "usr-102",
    fullName: "Omar Hassan",
    email: "omar@example.com",
    phone: "01198765432",
    address: "Downtown, Cairo, Egypt",
    role: "user",
    createdAt: "2026-02-10T14:30:00Z",
    ordersCount: 3,
  },
  {
    id: "usr-103",
    fullName: "Nour El-Din",
    email: "nour@example.com",
    phone: "01234567890",
    address: "Zamalek, Cairo, Egypt",
    role: "user",
    createdAt: "2026-03-01T09:15:00Z",
    ordersCount: 5,
  },
];

export default function AdminUsersPage() {
  const [users] = useState(MOCK_USERS);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
          <Users className="h-3.5 w-3.5" />
          <span>Customer Accounts</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Registered Users
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View registered customer accounts, roles, and order activity.
        </p>
      </div>

      {/* Users Table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase bg-muted/20">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4 text-right">Orders Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((usr) => (
              <tr key={usr.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-bold text-foreground block">{usr.fullName}</span>
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
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    {usr.address || "N/A"}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      usr.role === "admin"
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {usr.role === "admin" ? "Administrator" : "Customer"}
                  </span>
                </td>

                <td className="py-4 px-4 text-right font-extrabold text-foreground">
                  {usr.ordersCount} orders
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
