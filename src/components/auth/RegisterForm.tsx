/**
 * RegisterForm Component
 *
 * What it does:
 * Renders the registration form using React Hook Form + Zod validation schema.
 * Checks `/api/auth/providers` dynamically and renders "Sign up with Google" ONLY
 * when Google OAuth provider is configured in backend.
 * Adds full accessibility autocomplete attributes:
 * - Full Name: `autocomplete="name"`
 * - Email: `autocomplete="email"`
 * - Phone: `autocomplete="tel"`
 * - Address: `autocomplete="street-address"`
 * - Password: `autocomplete="new-password"`
 * - Confirm Password: `autocomplete="new-password"`
 *
 * Where it belongs:
 * src/components/auth/RegisterForm.tsx
 */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { User as UserIcon, Mail, Lock, Phone, MapPin, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthInput } from "./AuthInput";
import { Button } from "@/components/ui/button";

/** Google G Logo Component */
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

/** Register Form Zod Schema */
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^01[0125]\d{8}$/, "Enter a valid Egyptian mobile number (e.g. 01012345678)"),
    address: z.string().min(5, "Delivery address must be at least 5 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/profile";

  const { update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleAvailable, setIsGoogleAvailable] = useState(false);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((response) => response.json())
      .then((providers) => setIsGoogleAvailable(Boolean(providers.google)))
      .catch(() => setIsGoogleAvailable(false));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "010",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error("Registration failed", {
          description: result.error || "Failed to create account",
        });
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!signInResult || signInResult.error) {
        toast.success("Account created successfully!", {
          description: "Please sign in with your new credentials.",
        });
        router.push("/login");
        return;
      }

      await update();

      toast.success("Account created successfully!", {
        description: "Welcome to Pizza House.",
      });

      router.refresh();
      router.push(returnUrl);
    } catch {
      toast.error("Registration failed", {
        description: "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle Google OAuth Register/Login */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: returnUrl || "/" });
    } catch {
      toast.error("Google sign up failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Google OAuth Register Button — Always Visible */}
      {isGoogleAvailable && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full gap-3 font-semibold h-11 rounded-2xl border-border/80 bg-card/80 hover:bg-muted/60 text-foreground transition-all"
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <GoogleIcon className="h-4 w-4" />
            )}
            <span>Sign up with Google</span>
          </Button>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-border/60 w-full" />
            <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider absolute">
              or complete registration
            </span>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 w-full" noValidate>
        <AuthInput
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Omar Hassan"
          disabled={isSubmitting}
          icon={UserIcon}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <AuthInput
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="omar@example.com"
          disabled={isSubmitting}
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthInput
          label="Mobile Phone"
          type="tel"
          autoComplete="tel"
          placeholder="01012345678"
          disabled={isSubmitting}
          icon={Phone}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <AuthInput
          label="Delivery Address"
          type="text"
          autoComplete="street-address"
          placeholder="Building, Street, District, Cairo"
          disabled={isSubmitting}
          icon={MapPin}
          error={errors.address?.message}
          {...register("address")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthInput
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isSubmitting}
            icon={Lock}
            error={errors.password?.message}
            {...register("password")}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            disabled={isSubmitting}
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full gap-2 font-bold shadow-lg shadow-primary/25 rounded-2xl h-12 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Create Account
              <ArrowRight className="h-4 w-4 ml-auto" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
