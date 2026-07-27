import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const updateCategorySchema = z.object({
  name: z.string().trim().min(2).optional(),
  slug: z.string().trim().min(2).optional(),
  image: z.string().optional(),
  description: z.string().optional(),
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
    const values = updateCategorySchema.parse(await request.json());
    const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    const category = await prisma.category.update({ where: { id }, data: values });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to update category" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to delete category" }, { status: 500 });
  }
}
