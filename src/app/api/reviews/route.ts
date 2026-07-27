import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  pizzaId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(2).max(1000),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const requestedStatus = searchParams.get("status") || "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));
  const user = await getSessionUser();
  const isAdmin = user?.role === "ADMIN";
  const where: Prisma.ReviewWhereInput = {};

  if (query) where.comment = { contains: query, mode: "insensitive" };
  if (isAdmin && requestedStatus && requestedStatus !== "All") {
    where.status = requestedStatus;
  } else if (!isAdmin) {
    where.status = "Approved";
  }

  try {
    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: { user: { select: { name: true } }, pizza: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
        id: review.id,
        userId: review.userId,
        userName: review.user?.name || "Anonymous",
        pizzaId: review.pizzaId,
        pizzaName: review.pizza.name,
        rating: review.rating,
        comment: review.comment,
        status: review.status,
        createdAt: review.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    const values = reviewSchema.parse(await request.json());
    const review = await prisma.review.create({
      data: { ...values, userId: user.id, status: "Pending" },
      include: { user: { select: { name: true } }, pizza: { select: { name: true } } },
    });

    return NextResponse.json({
      success: true,
      review: {
        ...review,
        userName: review.user?.name || "Anonymous",
        pizzaName: review.pizza.name,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to submit review" }, { status: 500 });
  }
}
