/**
 * Admin Categories CRUD Page
 *
 * What it does:
 * Full CRUD for pizza categories: Add, Edit, Delete with search, toasts, and confirm dialog.
 *
 * Where it belongs:
 * src/app/admin/categories/page.tsx
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FolderTree, Plus, Search, Edit2, Trash2, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  createdAt: string;
}

const emptyForm = { name: "", slug: "", image: "/images/pizza-margherita.png", description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      const res = await fetch(`/api/categories?${params.toString()}`);
      const data = await res.json();
      if (data.success) setCategories(data.categories || []);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCategories();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCategories]);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (form.slug.trim().length < 2) errors.slug = "Slug must be at least 2 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      image: form.image.trim() || "/images/pizza-margherita.png",
      description: form.description.trim(),
    };

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Category updated" : "Category created");
        closeForm();
        fetchCategories();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, image: cat.image || "", description: cat.description || "" });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/categories/${deleteTarget}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Category deleted"); fetchCategories(); }
      else toast.error(data.error || "Failed to delete");
    } catch { toast.error("Failed to delete category"); }
    finally { setDeleteLoading(false); setDeleteTarget(null); }
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); setFormErrors({}); };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1 flex items-center gap-2.5">
            <span>Categories</span>
            <FolderTree className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Organize pizza categories and menu filter tabs.</p>
        </div>
        <Button size="sm" className="rounded-2xl gap-2 font-bold self-start sm:self-auto" onClick={() => { closeForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search categories..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search categories"
          className="h-10 w-full rounded-xl border border-border/60 bg-muted/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/60 bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-foreground">{editingId ? "Edit Category" : "Add New Category"}</h2>
                <button type="button" onClick={closeForm} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="cat-name" className="text-xs font-bold text-foreground">Name *</label>
                  <input id="cat-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className={cn("mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary", formErrors.name ? "border-destructive" : "border-border/60")} />
                  {formErrors.name && <p className="mt-1 text-[11px] text-destructive">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="cat-slug" className="text-xs font-bold text-foreground">Slug *</label>
                  <input id="cat-slug" type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={cn("mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary", formErrors.slug ? "border-destructive" : "border-border/60")} />
                  {formErrors.slug && <p className="mt-1 text-[11px] text-destructive">{formErrors.slug}</p>}
                </div>
                <div>
                  <label htmlFor="cat-image" className="text-xs font-bold text-foreground">Image URL</label>
                  <input id="cat-image" type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="cat-desc" className="text-xs font-bold text-foreground">Description</label>
                  <textarea id="cat-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={closeForm} className="rounded-xl font-bold">Cancel</Button>
                <Button size="sm" onClick={handleSubmit} disabled={submitting} className="rounded-xl font-bold gap-2">
                  {submitting && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {editingId ? "Save Changes" : "Create Category"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card/60 p-12 text-center backdrop-blur-md">
          <p className="text-sm text-muted-foreground">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-md shadow-sm hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">/{cat.slug}</p>
                  {cat.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{cat.description}</p>}
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary shrink-0 ml-3">Active</span>
              </div>
              <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-end gap-1.5">
                <button type="button" onClick={() => handleEdit(cat)} aria-label={`Edit ${cat.name}`}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setDeleteTarget(cat.id)} aria-label={`Delete ${cat.name}`}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all focus:outline-none focus:ring-2 focus:ring-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Category" message="Are you sure you want to permanently delete this category? Pizzas using this category will not be affected."
        confirmLabel="Delete Category" loading={deleteLoading} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </motion.div>
  );
}
