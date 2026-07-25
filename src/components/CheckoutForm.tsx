/**
 * CheckoutForm Component
 *
 * What it does:
 * Renders customer shipping & delivery information fields using React Hook Form
 * and Zod validation schema (Full Name, Phone Number, Delivery Address, Notes).
 *
 * Why it exists:
 * Collects required customer contact & delivery details before order placement.
 *
 * Where it belongs:
 * src/components/CheckoutForm.tsx
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, MapPin, FileText } from "lucide-react";

/** Zod Validation Schema for Checkout Form */
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+20|0)?1[0125]\d{8}$/,
      "Please enter a valid Egyptian phone number (e.g., 01012345678)"
    ),
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
      phone: "",
      address: "",
      notes: "",
    },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      
      {/* 1. Full Name */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Full Name <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
            <User className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="John Doe"
            {...register("fullName")}
            className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.fullName ? "border-destructive focus:ring-destructive" : "border-border/60"
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="mt-1.5 text-xs text-destructive font-medium">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* 2. Phone Number */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Phone Number <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground">
            <Phone className="h-4 w-4" />
          </div>
          <input
            type="tel"
            placeholder="01012345678"
            {...register("phone")}
            className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.phone ? "border-destructive focus:ring-destructive" : "border-border/60"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="mt-1.5 text-xs text-destructive font-medium">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* 3. Delivery Address */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Delivery Address <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-muted-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <textarea
            rows={3}
            placeholder="Street address, building number, floor, apartment..."
            {...register("address")}
            className={`w-full rounded-2xl border bg-card/60 pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.address ? "border-destructive focus:ring-destructive" : "border-border/60"
            }`}
          />
        </div>
        {errors.address && (
          <p className="mt-1.5 text-xs text-destructive font-medium">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* 4. Order Notes (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Order Notes <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute top-3.5 left-3.5 pointer-events-none text-muted-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <textarea
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
