/**
 * ReviewsSection Component
 *
 * What it does:
 * Renders static customer reviews cards with 5-star ratings, author names, and verified diner badges.
 *
 * Where it belongs:
 * src/components/ReviewsSection.tsx
 */

import { Star, MessageSquare } from "lucide-react";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export const DUMMY_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Omar Hassan",
    rating: 5,
    date: "2 days ago",
    comment: "Hands down the best crust in Cairo! The 48-hour fermented dough makes a huge difference.",
  },
  {
    id: "rev-2",
    author: "Nour El-Din",
    rating: 5,
    date: "1 week ago",
    comment: "Piping hot delivery in under 25 minutes! Fresh mozzarella and generous toppings.",
  },
  {
    id: "rev-3",
    author: "Youssef Farouk",
    rating: 5,
    date: "2 weeks ago",
    comment: "Authentic wood-fired taste. The truffle wild mushroom pizza is a masterpiece!",
  },
];

export default function ReviewsSection() {
  return (
    <div className="flex flex-col gap-6 pt-10 border-t border-border/50">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Customer Reviews</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DUMMY_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm"
          >
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground italic">
                &quot;{rev.comment}&quot;
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center text-xs">
              <span className="font-bold text-foreground">{rev.author}</span>
              <span className="text-muted-foreground text-[11px]">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
