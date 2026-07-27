import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const updateCouponSchema = z.object({
  code: z.string().trim().min(2).toUpperCase().optional(),
  discount: z.number().positive().optional(),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

async function hasAdminAccess() {
  return (await getSessionUser())?.role === "ADMIN";
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const values = updateCouponSchema.parse(body);

    const existing = await prisma.coupon.findUnique({ where: { id }, select: { id: true, code: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    if (values.code && values.code !== existing.code) {
      const codeTaken = await prisma.coupon.findUnique({ where: { code: values.code } });
      if (codeTaken) {
        return NextResponse.json({ success: false, error: "Coupon code already exists" }, { status: 400 });
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(values.code ? { code: values.code } : {}),
        ...(values.discount !== undefined ? { discount: values.discount } : {}),
        ...(values.expiresAt !== undefined ? { expiresAt: values.expiresAt ? new Date(values.expiresAt) : null } : {}),
        ...(values.isActive !== undefined ? { isActive: values.isActive } : {}),
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to update coupon" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.coupon.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
    }

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to delete coupon" }, { status: 500 });
  }
}
