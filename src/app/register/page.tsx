/**
 * Register Page Component
 *
 * What it does:
 * Renders the register page wrapper with Framer Motion entrance animation,
 * RegisterForm, and link to login page.
 *
 * Where it belongs:
 * src/app/register/page.tsx (accessible at /register)
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-16 flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-lg w-full px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center"
          >
            {/* Header Icon & Title */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-inner mx-auto mb-4">
              <UserPlus className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Create an Account
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground mb-6">
              Join Pizza House to enjoy faster checkout, order history, and exclusive deals.
            </p>

            {/* Register Form */}
            <RegisterForm />

            {/* Login Link */}
            <div className="mt-6 pt-5 border-t border-border/40 text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Sign in here
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
