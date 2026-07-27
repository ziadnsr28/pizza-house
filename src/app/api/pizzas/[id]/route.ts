import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const updatePizzaSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().min(5).optional(),
  image: z.string().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  price: z.number().positive().optional(),
  ingredients: z.array(z.string()).optional(),
  available: z.boolean().optional(),
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
    const values = updatePizzaSchema.parse(await request.json());
    const existing = await prisma.pizza.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Pizza not found" }, { status: 404 });
    }

    const category = values.category
      ? await prisma.category.findUnique({ where: { name: values.category } })
      : undefined;
    const pizza = await prisma.pizza.update({
      where: { id },
      data: {
        ...(values.name ? { name: values.name } : {}),
        ...(values.description ? { description: values.description } : {}),
        ...(values.image ? { image: values.image } : {}),
        ...(values.category ? { category: values.category } : {}),
        ...(values.price ? { price: values.price } : {}),
        ...(values.available !== undefined ? { available: values.available } : {}),
        ...(values.ingredients ? { ingredients: JSON.stringify(values.ingredients) } : {}),
        ...(values.category ? { categoryId: category?.id ?? undefined } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      pizza: { ...pizza, ingredients: JSON.parse(pizza.ingredients || "[]") },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to update pizza" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.pizza.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Pizza not found" }, { status: 404 });
    }
    await prisma.pizza.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Pizza deleted successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to delete pizza" }, { status: 500 });
  }
}
