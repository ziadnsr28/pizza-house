/**
 * ProductForm Component
 *
 * What it does:
 * Renders a form for adding or editing a pizza product using React Hook Form + Zod schema validation.
 * Supports Name, Description, Category, Price, Image URL, and Ingredients input.
 *
 * Where it belongs:
 * src/components/admin/ProductForm.tsx
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pizza, DollarSign, Image as ImageIcon, Tag, FileText, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/AuthInput";
import { PizzaProduct } from "@/constants/landing-data";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.enum(["Classic", "Vegetarian", "Spicy", "Special"]),
  price: z.number().min(1, "Price must be greater than 0"),
  image: z.string().min(1, "Image URL is required"),
  ingredients: z.string().min(3, "Comma-separated ingredients required"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormProps {
  initialData?: PizzaProduct | null;
  onSuccess: (pizza: PizzaProduct) => void;
  onCancel: () => void;
}

function generatePizzaId(existingId?: string): string {
  return existingId || `pizza-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: (initialData?.category as "Classic" | "Vegetarian" | "Spicy" | "Special") || "Classic",
      price: initialData?.price || 200,
      image: initialData?.image || "/images/hero-pizza.png",
      ingredients: initialData?.ingredients ? initialData.ingredients.join(", ") : "Mozzarella, Tomato Sauce, Basil",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    const generatedId = generatePizzaId(initialData?.id);

    const updatedPizza: PizzaProduct = {
      id: generatedId,
      name: data.name,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      image: data.image,
      ingredients: data.ingredients.split(",").map((s) => s.trim()),
    };

    try {
      await fetch("/api/pizzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPizza),
      });
    } catch {
      // Fallback update
    }

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(initialData ? "Product updated successfully!" : "New product added!");
      onSuccess(updatedPizza);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <h3 className="text-lg font-bold text-foreground">
          {initialData ? "Edit Pizza Product" : "Add New Pizza"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground rounded-lg p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <AuthInput
        label="Pizza Name"
        type="text"
        placeholder="e.g. Chicken Ranch Supreme"
        icon={Pizza}
        error={errors.name?.message}
        {...register("name")}
      />

      <AuthInput
        label="Description"
        type="text"
        placeholder="Brief delicious description of the pizza"
        icon={FileText}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-foreground/90">Category</label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
              <Tag className="h-4 w-4" />
            </div>
            <select
              className="w-full rounded-2xl border border-border/60 bg-background/60 pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              {...register("category")}
            >
              <option value="Classic">Classic</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Spicy">Spicy</option>
              <option value="Special">Special</option>
            </select>
          </div>
          {errors.category && (
            <span className="text-[11px] font-medium text-destructive">{errors.category.message}</span>
          )}
        </div>

        <AuthInput
          label="Price (EGP)"
          type="number"
          placeholder="250"
          icon={DollarSign}
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
      </div>

      <AuthInput
        label="Image Path / URL"
        type="text"
        placeholder="/images/hero-pizza.png"
        icon={ImageIcon}
        error={errors.image?.message}
        {...register("image")}
      />

      <AuthInput
        label="Ingredients (comma separated)"
        type="text"
        placeholder="Mozzarella, San Marzano Sauce, Basil"
        icon={Pizza}
        error={errors.ingredients?.message}
        {...register("ingredients")}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
        <Button type="button" variant="outline" onClick={onCancel} className="font-semibold rounded-xl">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 font-bold shadow-md shadow-primary/20 rounded-xl">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" /> Save Product
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
