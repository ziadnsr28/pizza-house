/**
 * User Profile Page Component
 *
 * What it does:
 * Renders the protected user profile page displaying avatar, name, email, phone,
 * address, joined date, and edit profile UI.
 *
 * Where it belongs:
 * src/app/profile/page.tsx (accessible at /profile)
 */

"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { useAuthStore } from "@/stores/auth-store";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const isClient = useIsClient();
  const { status } = useSession();
  const { isAuthenticated } = useAuthStore();

  const isAuth = isClient && (status === "authenticated" || isAuthenticated);

  useEffect(() => {
    if (isClient && status !== "loading" && !isAuth) {
      router.push("/login?returnUrl=/profile");
    }
  }, [isClient, status, isAuth, router]);

  if (!isClient || status === "loading" || !isAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Checking authentication session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-16 flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                <UserIcon className="h-3.5 w-3.5" />
                <span>Customer Account</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                My Profile
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Manage your personal profile, phone number, and delivery address.
              </p>
            </div>

            {/* Profile Card Component */}
            <ProfileCard />
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
