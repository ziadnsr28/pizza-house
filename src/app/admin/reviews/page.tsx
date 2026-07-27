/**
 * Admin Reviews Page
 *
 * What it does:
 * Displays live reviews from the database with approve/reject/delete actions,
 * search, status filter, and pagination.
 *
 * Where it belongs:
 * src/app/admin/reviews/page.tsx
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  ArrowLeft,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminPagination from "@/components/admin/AdminPagination";

interface ReviewItem {
  id: string;
  userId?: string | null;
  userName: string;
  pizzaId: string;
  pizzaName: string;
  rating: number;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_FILTER_OPTIONS = ["All", "Pending", "Approved", "Rejected"];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 10, total: 0, totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Confirm dialog state
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (statusFilter !== "All") params.set("status", statusFilter);
      params.set("page", page.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [query, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchReviews(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchReviews]);

  const handleStatusChange = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        toast.success(`Review ${newStatus.toLowerCase()} successfully`);
      } else {
        toast.error(data.error || "Failed to update review");
      }
    } catch {
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/reviews/${deleteTarget}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget));
        toast.success("Review deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete review");
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: typeof Clock; className: string }> = {
      Pending: {
        icon: Clock,
        className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
      },
      Approved: {
        icon: CheckCircle2,
        className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      },
      Rejected: {
        icon: XCircle,
        className: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
      },
    };
    const cfg = config[status] || config.Pending;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cfg.className}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 pb-12"
    >
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1 flex items-center gap-2.5">
          <span>Reviews & Ratings</span>
          <MessageSquare className="h-6 w-6 text-primary" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage customer feedback. Approve, reject, or remove reviews.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            aria-label="Search reviews"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/60 bg-muted/40 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="h-10 rounded-xl border border-border/60 bg-muted/40 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-border/60 bg-card/60 p-12 text-center backdrop-blur-md">
            <p className="text-sm text-muted-foreground">No reviews found.</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="rounded-3xl border border-border/60 bg-card/60 p-5 backdrop-blur-md shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-extrabold text-foreground">{review.userName}</span>
                    {getStatusBadge(review.status)}
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    on <span className="font-bold text-foreground">{review.pizzaName}</span>
                  </p>

                  <div className="flex items-center gap-0.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                        )}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-muted-foreground">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed italic">
                    &quot;{review.comment}&quot;
                  </p>

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {review.status !== "Approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(review.id, "Approved")}
                      className="rounded-xl gap-1.5 text-xs font-bold text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                  )}

                  {review.status !== "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(review.id, "Rejected")}
                      className="rounded-xl gap-1.5 text-xs font-bold text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteTarget(review.id)}
                    className="rounded-xl gap-1.5 text-xs font-bold text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <AdminPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={(p) => fetchReviews(p)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmLabel="Delete Review"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
