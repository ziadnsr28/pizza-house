/**
 * /api/pizzas API Route
 *
 * What it does:
 * - GET: Retrieves all pizzas from database or fallback dataset.
 * - POST: Creates a new pizza record in the database.
 *
 * Where it belongs:
 * src/app/api/pizzas/route.ts
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FULL_MENU_PIZZAS } from "@/constants/landing-data";

export async function GET() {
  try {
    const dbPizzas = await prisma.pizza.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbPizzas.length > 0) {
      return NextResponse.json({ success: true, pizzas: dbPizzas });
    }
  } catch {
    // If DB is offline or empty, fallback gracefully to central dataset
  }

  return NextResponse.json({ success: true, pizzas: FULL_MENU_PIZZAS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image, category, price, ingredients } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (name, price, category)" },
        { status: 400 }
      );
    }

    const newPizza = await prisma.pizza.create({
      data: {
        name,
        description: description || "",
        image: image || "/images/hero-pizza.png",
        category,
        price: Number(price),
        ingredients: Array.isArray(ingredients) ? JSON.stringify(ingredients) : "[]",
      },
    });

    return NextResponse.json({ success: true, pizza: newPizza }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create pizza in database" },
      { status: 500 }
    );
  }
}
