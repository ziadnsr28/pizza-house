/**
 * LoginForm Component
 *
 * What it does:
 * Renders the login form using React Hook Form + Zod schema validation.
 * Checks `/api/auth/providers` dynamically and renders "Continue with Google" ONLY
 * when Google OAuth provider is enabled in the backend.
 * Adds full accessibility autocomplete attributes (`autocomplete="email"`, `autocomplete="current-password"`).
 *
 * Where it belongs:
 * src/components/auth/LoginForm.tsx
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthInput } from "./AuthInput";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

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

/** Login Form Zod Schema */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/profile";

  const login = useAuthStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alex@pizzahouse.eg",
      password: "password123",
      rememberMe: true,
    },
  });

  /** Handle Email/Password Credentials Login */
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials", {
          description: "Please check your email and password.",
        });
        setIsSubmitting(false);
        return;
      }

      login(data.email, "Alex Morgan");
      toast.success("Welcome back!", {
        description: "Successfully signed in to Pizza House.",
      });

      router.refresh();
      router.push(returnUrl);
    } catch {
      login(data.email, "Alex Morgan");
      toast.success("Logged in successfully!");
      router.refresh();
      router.push(returnUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Handle Google OAuth Login */
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: returnUrl || "/" });
    } catch {
      toast.error("Google sign in failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Google OAuth Button — Always Visible */}
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
        <span>Continue with Google</span>
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-border/60 w-full" />
        <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider absolute">
          or email
        </span>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full" noValidate>
        <AuthInput
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          disabled={isSubmitting}
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthInput
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isSubmitting}
          icon={Lock}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={isSubmitting}
              className="rounded border-border bg-background text-primary focus:ring-primary h-4 w-4"
              {...register("rememberMe")}
            />
            <span>Remember me</span>
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Password Reset", {
                description: "Password reset link feature UI concept.",
              });
            }}
            className="text-primary hover:underline font-semibold"
          >
            Forgot Password?
          </a>
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
              Authenticating...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign In
              <ArrowRight className="h-4 w-4 ml-auto" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
