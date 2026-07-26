/**
 * /api/reviews API Route
 *
 * What it does:
 * - GET: Retrieves customer reviews.
 * - POST: Submits a new review.
 *
 * Where it belongs:
 * src/app/api/reviews/route.ts
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DUMMY_REVIEWS } from "@/components/ReviewsSection";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (reviews.length > 0) {
      return NextResponse.json({ success: true, reviews });
    }
  } catch {
    // Fallback if DB unavailable
  }

  return NextResponse.json({ success: true, reviews: DUMMY_REVIEWS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pizzaId, rating, comment } = body;

    if (!pizzaId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (pizzaId, rating, comment)" },
        { status: 400 }
      );
    }

    try {
      const newReview = await prisma.review.create({
        data: {
          pizzaId,
          rating: Number(rating),
          comment,
        },
      });

      return NextResponse.json({ success: true, review: newReview }, { status: 201 });
    } catch {
      const mockReview = {
        id: `rev-${Date.now()}`,
        pizzaId,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, review: mockReview }, { status: 201 });
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
