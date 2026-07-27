import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if ((await getSessionUser())?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const [ordersCount, revenueAggregate, customersCount, pizzasCount, pendingCount, completedCount] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.pizza.count(),
        prisma.order.count({ where: { status: "Pending" } }),
        prisma.order.count({ where: { status: "Delivered" } }),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: ordersCount,
        totalRevenue: revenueAggregate._sum.total || 0,
        totalCustomers: customersCount,
        totalPizzas: pizzasCount,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load dashboard statistics" }, { status: 500 });
  }
}
