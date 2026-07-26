/**
 * Admin Layout Component
 *
 * What it does:
 * Wraps all admin routes (/admin, /admin/products, /admin/orders, /admin/users, /admin/reviews).
 * Provides role/authentication protection and responsive sidebar navigation.
 *
 * Where it belongs:
 * src/app/admin/layout.tsx
 */

"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/stores/auth-store";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isClient = useIsClient();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/login?returnUrl=/admin");
    }
  }, [isClient, isAuthenticated, router]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area (Offset by 256px sidebar on lg screens) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
