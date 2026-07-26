/**
 * Admin Reviews Management Page Component
 *
 * What it does:
 * Displays customer reviews and ratings with moderation controls (delete review).
 *
 * Where it belongs:
 * src/app/admin/reviews/page.tsx (accessible at /admin/reviews)
 */

"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DUMMY_REVIEWS, ReviewItem } from "@/components/ReviewsSection";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(DUMMY_REVIEWS);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Review removed from moderation queue.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Customer Feedback</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Reviews Moderation
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review customer feedback, ratings, and moderate inappropriate comments.
        </p>
      </div>

      {/* Reviews Table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase bg-muted/20">
              <th className="py-3.5 px-4">Author</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Comment</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-bold text-foreground block">{rev.author}</span>
                  <span className="text-xs text-muted-foreground">{rev.date}</span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted/40"
                        }`}
                      />
                    ))}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <p className="text-sm text-foreground leading-relaxed max-w-lg">
                    {rev.comment}
                  </p>
                </td>

                <td className="py-4 px-4 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(rev.id)}
                    className="h-8 w-8 p-0 rounded-lg"
                    aria-label="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-muted-foreground">
                  No reviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
