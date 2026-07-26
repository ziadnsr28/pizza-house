/**
 * AuthInput Component
 *
 * What it does:
 * Renders a stylized, accessible input field with optional left icon, right toggle icon (for password visibility),
 * floating label, and Zod error message feedback.
 *
 * Where it belongs:
 * src/components/auth/AuthInput.tsx
 */

"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ElementType;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon: Icon, type = "text", className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const computedType = isPasswordType ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        <label className="text-xs font-semibold text-foreground/90">
          {label}
        </label>

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <input
            ref={ref}
            type={computedType}
            className={cn(
              "w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              Icon && "pl-10",
              isPasswordType && "pr-10",
              error && "border-destructive focus:ring-destructive/20",
              className
            )}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {error && (
          <span className="text-[11px] font-medium text-destructive mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
