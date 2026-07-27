import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const couponSchema = z.object({
  code: z.string().trim().min(2, "Code must be at least 2 characters").toUpperCase(),
  discount: z.number().positive("Discount must be positive"),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

async function hasAdminAccess() {
  return (await getSessionUser())?.role === "ADMIN";
}

export async function GET(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const where: Prisma.CouponWhereInput = query
    ? { code: { contains: query, mode: "insensitive" } }
    : {};

  try {
    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load coupons" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const values = couponSchema.parse(body);

    const existing = await prisma.coupon.findUnique({ where: { code: values.code } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: values.code,
        discount: values.discount,
        expiresAt: values.expiresAt ? new Date(values.expiresAt) : null,
        isActive: values.isActive,
      },
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to create coupon" }, { status: 500 });
  }
}
