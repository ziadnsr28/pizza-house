/**
 * ProfileCard Component
 *
 * What it does:
 * Renders user profile information card with editable fields (Full Name, Phone, Address),
 * logout action button, and order history link.
 *
 * Where it belongs:
 * src/components/ProfileCard.tsx
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, LogOut, Edit2, Check, ListOrdered } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfileCard() {
  const { user, logout, updateProfile } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    updateProfile({ phone, address });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      {/* Header Avatar & Name */}
      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border/40 text-center sm:text-left">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary/40 font-extrabold text-2xl shadow-inner shrink-0">
          {getInitials(user.fullName)}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-extrabold text-foreground">{user.fullName}</h2>
            <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-500">
              Active Member
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </p>
        </div>

        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="gap-2 font-semibold rounded-xl"
        >
          {isEditing ? (
            <>
              <Check className="h-4 w-4" /> Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" /> Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Info Fields */}
      <div className="flex flex-col gap-4 text-sm">
        {/* Email Field (Read-only) */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-border/50 bg-background/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block font-medium">Email Address</span>
            <span className="font-semibold text-foreground">{user.email}</span>
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-border/50 bg-background/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Phone className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block font-medium">Phone Number</span>
            {isEditing ? (
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-1 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <span className="font-semibold text-foreground">{user.phone || "Not set"}</span>
            )}
          </div>
        </div>

        {/* Address Field */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-border/50 bg-background/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-muted-foreground block font-medium">Default Shipping Address</span>
            {isEditing ? (
              <input
                type="text"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-1 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <span className="font-semibold text-foreground">{user.address || "Not set"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
        <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 font-semibold rounded-xl">
          <Link href="/orders" className="flex items-center gap-2">
            <ListOrdered className="h-4 w-4" />
            View Order History
          </Link>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            logout();
            toast.info("Logged out successfully.");
          }}
          className="w-full sm:w-auto gap-2 font-semibold rounded-xl"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
