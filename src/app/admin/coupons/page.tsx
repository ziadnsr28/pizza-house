/**
 * Admin Coupons CRUD Page
 *
 * What it does:
 * Full CRUD for discount coupons: Add, Edit, Delete with validation,
 * discount rates, expiration dates, active toggles, toasts, and confirm dialog.
 *
 * Where it belongs:
 * src/app/admin/coupons/page.tsx
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Plus, Search, Edit2, Trash2, ArrowLeft, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface CouponItem {
  id: string;
  code: string;
  discount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  code: "",
  discount: "",
  expiresAt: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      const res = await fetch(`/api/coupons?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons || []);
      }
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCoupons();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCoupons]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (form.code.trim().length < 2) errors.code = "Coupon code must be at least 2 characters";
    const discountNum = Number(form.discount);
    if (!discountNum || discountNum <= 0) errors.discount = "Discount must be a positive number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const payload = {
      code: form.code.trim().toUpperCase(),
      discount: Number(form.discount),
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      isActive: form.isActive,
    };

    try {
      const url = editingId ? `/api/coupons/${editingId}` : "/api/coupons";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Coupon updated successfully" : "Coupon created successfully");
        closeForm();
        fetchCoupons();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon: CouponItem) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "",
      isActive: coupon.isActive,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/coupons/${deleteTarget}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      } else {
        toast.error(data.error || "Failed to delete coupon");
      }
    } catch {
      toast.error("Failed to delete coupon");
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
            <span>Discount Coupons</span>
            <Ticket className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage promotional codes, discount amounts, and expiration dates.</p>
        </div>

        <Button size="sm" className="rounded-2xl gap-2 font-bold self-start sm:self-auto" onClick={() => { closeForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Coupon
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search coupon codes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search coupon codes"
          className="h-10 w-full rounded-xl border border-border/60 bg-muted/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeForm} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/60 bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-foreground">{editingId ? "Edit Coupon" : "Add New Coupon"}</h2>
                <button type="button" onClick={closeForm} className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="coupon-code" className="text-xs font-bold text-foreground">Coupon Code *</label>
                  <input
                    id="coupon-code"
                    type="text"
                    placeholder="e.g. PIZZA20"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={cn(
                      "mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary uppercase",
                      formErrors.code ? "border-destructive" : "border-border/60"
                    )}
                  />
                  {formErrors.code && <p className="mt-1 text-[11px] text-destructive">{formErrors.code}</p>}
                </div>

                <div>
                  <label htmlFor="coupon-discount" className="text-xs font-bold text-foreground">Discount Value (%) *</label>
                  <input
                    id="coupon-discount"
                    type="number"
                    placeholder="e.g. 15 for 15% OFF"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className={cn(
                      "mt-1 h-10 w-full rounded-xl border bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
                      formErrors.discount ? "border-destructive" : "border-border/60"
                    )}
                  />
                  {formErrors.discount && <p className="mt-1 text-[11px] text-destructive">{formErrors.discount}</p>}
                </div>

                <div>
                  <label htmlFor="coupon-expires" className="text-xs font-bold text-foreground">Expiration Date (Optional)</label>
                  <input
                    id="coupon-expires"
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="mt-1 h-10 w-full rounded-xl border border-border/60 bg-muted/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary"
                  />
                  <span className="text-xs font-bold text-foreground">Coupon Active</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={closeForm} className="rounded-xl font-bold">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={submitting} className="rounded-xl font-bold gap-2">
                  {submitting && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {editingId ? "Save Changes" : "Create Coupon"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Coupons Table */}
      <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Coupons table">
            <thead>
              <tr className="border-b border-border/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/20">
                <th scope="col" className="py-3.5 px-4">Coupon Code</th>
                <th scope="col" className="py-3.5 px-4">Discount</th>
                <th scope="col" className="py-3.5 px-4">Expiration</th>
                <th scope="col" className="py-3.5 px-4">Status</th>
                <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                    No coupons found. Add your first coupon code above.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, i) => (
                  <motion.tr
                    key={coupon.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-foreground text-sm">
                      <span className="rounded-lg bg-muted px-2.5 py-1 border border-border/50">{coupon.code}</span>
                    </td>
                    <td className="py-3 px-4 font-black text-primary text-xs">{coupon.discount}% OFF</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                        : "No Expiration"}
                    </td>
                    <td className="py-3 px-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(coupon)}
                          aria-label={`Edit ${coupon.code}`}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(coupon.id)}
                          aria-label={`Delete ${coupon.code}`}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all focus:outline-none focus:ring-2 focus:ring-destructive"
                        >
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Coupon"
        message="Are you sure you want to permanently delete this coupon code? Customers will no longer be able to apply it."
        confirmLabel="Delete Coupon"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
