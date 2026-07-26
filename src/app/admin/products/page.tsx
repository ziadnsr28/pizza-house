/**
 * Admin Product Management Page
 *
 * What it does:
 * Renders the products management page with product search, CategoryFilter, Add/Edit modal,
 * and ProductTable.
 *
 * Where it belongs:
 * src/app/admin/products/page.tsx (accessible at /admin/products)
 */

"use client";

import { useEffect, useState } from "react";
import { Plus, Pizza } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import { FULL_MENU_PIZZAS, PizzaProduct } from "@/constants/landing-data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<PizzaProduct[]>(FULL_MENU_PIZZAS);
  const [editingProduct, setEditingProduct] = useState<PizzaProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetch("/api/pizzas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pizzas) && data.pizzas.length > 0) {
          setProducts(data.pizzas);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: PizzaProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  const handleFormSuccess = (updatedPizza: PizzaProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === updatedPizza.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPizza.id ? updatedPizza : p));
      }
      return [updatedPizza, ...prev];
    });
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <Pizza className="h-3.5 w-3.5" />
            <span>Product Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Pizza Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, or remove pizza varieties from the menu database.
          </p>
        </div>

        <Button onClick={handleAddClick} size="lg" className="gap-2 font-bold shadow-lg shadow-primary/25 rounded-2xl">
          <Plus className="h-4 w-4" />
          Add New Pizza
        </Button>
      </div>

      {/* Modal Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/95 p-6 backdrop-blur-xl shadow-2xl">
            <ProductForm
              initialData={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Products Table */}
      <ProductTable
        products={products}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}
