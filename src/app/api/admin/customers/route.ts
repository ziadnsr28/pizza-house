import { NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  if ((await getSessionUser())?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));
  const where: Prisma.UserWhereInput = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }
  if (role && role !== "All" && Object.values(Role).includes(role as Role)) {
    where.role = role as Role;
  }

  try {
    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: { _count: { select: { orders: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    const userIds = users.map((user) => user.id);
    const totals = await prisma.order.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _sum: { total: true },
    });
    const totalByUser = new Map(totals.map((total) => [total.userId, total._sum.total || 0]));

    return NextResponse.json({
      success: true,
      customers: users.map((user) => ({
        id: user.id,
        name: user.name || "Unnamed User",
        email: user.email,
        phone: user.phone || "N/A",
        role: user.role,
        image: user.image || null,
        createdAt: user.createdAt,
        ordersCount: user._count.orders,
        totalSpent: totalByUser.get(user.id) || 0,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load customers" }, { status: 500 });
  }
}
