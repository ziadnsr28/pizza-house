import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const pizzaSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  description: z.string().trim().min(5, "Description must be at least 5 characters"),
  image: z.string().min(1, "Image URL is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: z.number().positive("Price must be a positive number"),
  ingredients: z.array(z.string()).default([]),
  available: z.boolean().default(true),
});

function serializePizza(pizza: { ingredients: string } & Record<string, unknown>) {
  try {
    return { ...pizza, ingredients: JSON.parse(pizza.ingredients || "[]") };
  } catch {
    return { ...pizza, ingredients: [] };
  }
}

async function hasAdminAccess() {
  return (await getSessionUser())?.role === "ADMIN";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const availability = searchParams.get("available") || "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));
  const where: Prisma.PizzaWhereInput = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }
  if (category && category !== "All") where.category = category;
  if (availability === "true") where.available = true;
  if (availability === "false") where.available = false;

  try {
    const [total, pizzas] = await Promise.all([
      prisma.pizza.count({ where }),
      prisma.pizza.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      pizzas: pizzas.map((pizza) => serializePizza(pizza)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load pizzas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const values = pizzaSchema.parse(await request.json());
    const category = await prisma.category.findUnique({ where: { name: values.category } });
    const pizza = await prisma.pizza.create({
      data: {
        ...values,
        categoryId: category?.id,
        ingredients: JSON.stringify(values.ingredients),
      },
    });

    return NextResponse.json({ success: true, pizza: serializePizza(pizza) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to create pizza" }, { status: 500 });
  }
}
