import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const reviewStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]),
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
    const values = reviewStatusSchema.parse(await request.json());
    const existing = await prisma.review.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }
    const review = await prisma.review.update({ where: { id }, data: values });
    return NextResponse.json({ success: true, review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to update review" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.review.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to delete review" }, { status: 500 });
  }
}
