/**
 * CheckoutForm Component
 *
 * What it does:
 * Renders customer shipping & delivery information fields using React Hook Form
 * and Zod validation schema.
 *
 * Fields:
 * - Full Name (required, min 3 chars)
 * - Email (required, valid format)
 * - Phone Number (required, Egyptian format)
 * - City (required)
 * - Delivery Address (required, min 5 chars)
 * - Order Notes (optional)
 *
 * Where it belongs:
 * src/components/CheckoutForm.tsx
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, MapPin, FileText, Mail, Building } from "lucide-react";

/** Zod Validation Schema for Checkout Form */
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+20|0)?1[0125]\d{8}$/,
      "Please enter a valid Egyptian phone number (e.g., 01012345678)"
    ),
  city: z
    .string()
    .min(1, "City is required"),
  address: z.string().min(5, "Delivery address is required (at least 5 characters)"),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  formId?: string;
}

export default function CheckoutForm({ onSubmit, formId = "checkout-form" }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      notes: "",
    },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

      {/* 1. Full Name */}
      <div>
        <label htmlFor="checkout-name" className="block text-sm font-semibold text-foreground mb-2">
          Full Name <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
            <User className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="checkout-name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "error-name" : undefined}
            {...register("fullName")}
            className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.fullName ? "border-destructive focus:ring-destructive" : "border-border/60"
            }`}
          />
        </div>
        {errors.fullName && (
          <p id="error-name" role="alert" className="mt-1.5 text-xs text-destructive font-medium">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* 2. Email */}
      <div>
        <label htmlFor="checkout-email" className="block text-sm font-semibold text-foreground mb-2">
          Email Address <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
            {...register("email")}
            className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? "border-destructive focus:ring-destructive" : "border-border/60"
            }`}
          />
        </div>
        {errors.email && (
          <p id="error-email" role="alert" className="mt-1.5 text-xs text-destructive font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 3. Phone + City — two columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone Number */}
        <div>
          <label htmlFor="checkout-phone" className="block text-sm font-semibold text-foreground mb-2">
            Phone Number <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
              <Phone className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="checkout-phone"
              type="tel"
              autoComplete="tel"
              placeholder="01012345678"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "error-phone" : undefined}
              {...register("phone")}
              className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.phone ? "border-destructive focus:ring-destructive" : "border-border/60"
              }`}
            />
          </div>
          {errors.phone && (
            <p id="error-phone" role="alert" className="mt-1.5 text-xs text-destructive font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="checkout-city" className="block text-sm font-semibold text-foreground mb-2">
            City <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
              <Building className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="checkout-city"
              type="text"
              autoComplete="address-level2"
              placeholder="Cairo"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "error-city" : undefined}
              {...register("city")}
              className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.city ? "border-destructive focus:ring-destructive" : "border-border/60"
              }`}
            />
          </div>
          {errors.city && (
            <p id="error-city" role="alert" className="mt-1.5 text-xs text-destructive font-medium">
              {errors.city.message}
            </p>
          )}
        </div>
      </div>

      {/* 4. Delivery Address */}
      <div>
        <label htmlFor="checkout-address" className="block text-sm font-semibold text-foreground mb-2">
          Delivery Address <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </div>
          <textarea
            id="checkout-address"
            rows={3}
            autoComplete="street-address"
            placeholder="Street address, building number, floor, apartment..."
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "error-address" : undefined}
            {...register("address")}
            className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.address ? "border-destructive focus:ring-destructive" : "border-border/60"
            }`}
          />
        </div>
        {errors.address && (
          <p id="error-address" role="alert" className="mt-1.5 text-xs text-destructive font-medium">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* 5. Order Notes (Optional) */}
      <div>
        <label htmlFor="checkout-notes" className="block text-sm font-semibold text-foreground mb-2">
          Order Notes{" "}
          <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-muted-foreground">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </div>
          <textarea
            id="checkout-notes"
            rows={2}
            placeholder="Extra sauce, don't ring doorbell, leave at door..."
            {...register("notes")}
            className="w-full rounded-2xl border border-border/60 bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

    </form>
  );
}
