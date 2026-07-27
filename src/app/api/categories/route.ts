import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: z.string().trim().min(2, "Slug must be at least 2 characters"),
  image: z.string().optional().default("/images/pizza-margherita.png"),
  description: z.string().optional().default(""),
});

async function hasAdminAccess() {
  return (await getSessionUser())?.role === "ADMIN";
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query") || "";
  const where: Prisma.CategoryWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  try {
    const categories = await prisma.category.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, categories });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminAccess())) {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const values = categorySchema.parse(await request.json());
    const category = await prisma.category.create({ data: values });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to create category" }, { status: 500 });
  }
}
