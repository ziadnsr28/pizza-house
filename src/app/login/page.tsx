/**
 * Login Page Component
 *
 * What it does:
 * Renders the login page wrapper with Framer Motion entrance animation,
 * LoginForm, and link to register page.
 *
 * Where it belongs:
 * src/app/login/page.tsx (accessible at /login)
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-16 flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-md w-full px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl text-center"
          >
            {/* Header Icon & Title */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner mx-auto mb-4">
              <LogIn className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground mb-6">
              Sign in to manage your orders, address, and saved favorites.
            </p>

            {/* Login Form */}
            <LoginForm />

            {/* Register Link */}
            <div className="mt-6 pt-5 border-t border-border/40 text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Create one now
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
