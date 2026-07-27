/**
 * Admin Pizzas CRUD Page
 *
 * What it does:
 * Full CRUD for pizzas: Add, Edit, Delete with Zod validation,
 * search, category & availability filters, pagination, toasts, and confirm dialog.
 *
 * Where it belongs:
 * src/app/admin/pizzas/page.tsx
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pizza, Plus, Search, Edit2, Trash2, ArrowLeft, Eye, EyeOff, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminPagination from "@/components/admin/AdminPagination";

interface PizzaItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  ingredients: string[];
  available: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const CATEGORY_OPTIONS = ["All", "Classic", "Special", "Spicy", "Vegetarian"];
const AVAILABILITY_OPTIONS = [
  { label: "All", value: "" },
  { label: "Available", value: "true" },
  { label: "Unavailable", value: "false" },
];

const emptyForm = {
  name: "", description: "", image: "/images/hero-pizza.png", category: "Classic",
  price: "", ingredients: "", available: true,
};

export default function AdminPizzasPage() {
  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [availFilter, setAvailFilter] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPizzas = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (catFilter !== "All") params.set("category", catFilter);
      if (availFilter) params.set("available", availFilter);
      params.set("page", page.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/pizzas?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPizzas(data.pizzas || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to load pizzas");
    } finally {
      setLoading(false);
    }
  }, [query, catFilter, availFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPizzas(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchPizzas]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (form.description.trim().length < 5) errors.description = "Description must be at least 5 characters";
    if (!form.image.trim()) errors.image = "Image URL is required";
    if (!form.category) errors.category = "Category is required";
    const price = Number(form.price);
    if (!price || price <= 0) errors.price = "Price must be a positive number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      category: form.category,
      price: Number(form.price),
      ingredients: form.ingredients ? form.ingredients.split(",").map((s) => s.trim()).filter(Boolean) : [],
      available: form.available,
    };

    try {
      const url = editingId ? `/api/pizzas/${editingId}` : "/api/pizzas";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Pizza updated successfully" : "Pizza created successfully");
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchPizzas(pagination.page);
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Failed to save pizza");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pizza: PizzaItem) => {
    setEditingId(pizza.id);
    setForm({
      name: pizza.name,
      description: pizza.description,
      image: pizza.image,
      category: pizza.category,
      price: pizza.price.toString(),
      ingredients: Array.isArray(pizza.ingredients) ? pizza.ingredients.join(", ") : "",
      available: pizza.available,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/pizzas/${deleteTarget}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Pizza deleted successfully");
        fetchPizzas(pagination.page);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete pizza");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1 flex items-center gap-2.5">
            <span>Pizzas Catalog</span>
            <Pizza className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage pizza varieties, pricing, and availability.</p>
        </div>

        <Button size="sm" className="rounded-2xl gap-2 font-bold self-start sm:self-auto" onClick={() => { closeForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Pizza
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search pizzas..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search pizzas"
            className="h-10 w-full rounded-xl border border-border/60 bg-muted/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} aria-label="Filter by category"
          className="h-10 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none">
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} aria-label="Filter by availability"
          className="h-10 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none">
          {AVAILABILITY_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-foreground">{editingId ? "Edit Pizza" : "Add New Pizza"}</h2>
                <button type="button" onClick={closeForm} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="pizza-name" className="text-xs font-bold text-foreground">Name *</label>
                  <input id="pizza-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={cn("mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary", formErrors.name ? "border-destructive" : "border-border/60")} />
                  {formErrors.name && <p className="mt-1 text-[11px] text-destructive">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="pizza-desc" className="text-xs font-bold text-foreground">Description *</label>
                  <textarea id="pizza-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={cn("mt-1 w-full rounded-xl border bg-muted/40 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none", formErrors.description ? "border-destructive" : "border-border/60")} />
                  {formErrors.description && <p className="mt-1 text-[11px] text-destructive">{formErrors.description}</p>}
                </div>
                <div>
                  <label htmlFor="pizza-image" className="text-xs font-bold text-foreground">Image URL *</label>
                  <input id="pizza-image" type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className={cn("mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary", formErrors.image ? "border-destructive" : "border-border/60")} />
                  {formErrors.image && <p className="mt-1 text-[11px] text-destructive">{formErrors.image}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="pizza-category" className="text-xs font-bold text-foreground">Category *</label>
                    <select id="pizza-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1 h-10 w-full rounded-xl border border-border/60 bg-muted/40 px-3 text-xs font-semibold text-foreground focus:outline-none">
                      {["Classic", "Special", "Spicy", "Vegetarian"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pizza-price" className="text-xs font-bold text-foreground">Price (EGP) *</label>
                    <input id="pizza-price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={cn("mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary", formErrors.price ? "border-destructive" : "border-border/60")} />
                    {formErrors.price && <p className="mt-1 text-[11px] text-destructive">{formErrors.price}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="pizza-ingredients" className="text-xs font-bold text-foreground">Ingredients (comma separated)</label>
                  <input id="pizza-ingredients" type="text" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="Pepperoni, Mozzarella, Tomato Sauce"
                    className="mt-1 h-10 w-full rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 rounded accent-primary" />
                  <span className="text-xs font-bold text-foreground">Available on menu</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={closeForm} className="rounded-xl font-bold">Cancel</Button>
                <Button size="sm" onClick={handleSubmit} disabled={submitting} className="rounded-xl font-bold gap-2">
                  {submitting && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {editingId ? "Save Changes" : "Create Pizza"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pizza Table */}
      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Pizzas table">
            <thead>
              <tr className="border-b border-border/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                <th scope="col" className="py-3.5 px-4">Item</th>
                <th scope="col" className="py-3.5 px-4">Category</th>
                <th scope="col" className="py-3.5 px-4">Price</th>
                <th scope="col" className="py-3.5 px-4">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center"><div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></td></tr>
              ) : pizzas.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">No pizzas found. Add your first pizza above.</td></tr>
              ) : (
                pizzas.map((pizza, i) => (
                  <motion.tr key={pizza.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/50">
                          <Image src={pizza.image} alt={pizza.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-foreground text-xs truncate">{pizza.name}</span>
                          <span className="block text-[10px] text-muted-foreground line-clamp-1">{pizza.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">{pizza.category}</span></td>
                    <td className="py-3 px-4 font-black text-primary text-xs">{formatPrice(pizza.price)}</td>
                    <td className="py-3 px-4">
                      {pizza.available ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Eye className="h-3 w-3" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                          <EyeOff className="h-3 w-3" /> Unavailable
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" onClick={() => handleEdit(pizza)} aria-label={`Edit ${pizza.name}`}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(pizza.id)} aria-label={`Delete ${pizza.name}`}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all focus:outline-none focus:ring-2 focus:ring-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminPagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={(p) => fetchPizzas(p)} />

      <ConfirmDialog open={!!deleteTarget} title="Delete Pizza" message="Are you sure you want to permanently delete this pizza from the catalog? This action cannot be undone."
        confirmLabel="Delete Pizza" loading={deleteLoading} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </motion.div>
  );
}
