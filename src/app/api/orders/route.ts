import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  items: z.array(
    z.object({
      pizzaId: z.string().min(1),
      quantity: z.number().int().positive(),
      size: z.string().min(1).default("Medium"),
      toppings: z.array(z.string()).default([]),
      price: z.number().positive(),
    })
  ).min(1, "An order must include at least one pizza"),
  totalAmount: z.number().positive(),
  customerName: z.string().trim().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().trim().min(1),
  customerAddress: z.string().trim().min(5),
  customerCity: z.string().trim().optional(),
  notes: z.string().trim().max(1000).optional(),
  paymentMethod: z.string().trim().min(1),
});

const orderUpdateSchema = z.object({
  status: z.enum(["Pending", "Preparing", "Out For Delivery", "Delivered", "Cancelled"]).optional(),
  paymentStatus: z.enum(["Paid", "Unpaid", "Refunded"]).optional(),
}).refine((values) => values.status !== undefined || values.paymentStatus !== undefined, {
  message: "Provide a status or payment status",
});

function parseToppings(toppings: string) {
  try {
    return JSON.parse(toppings || "[]") as string[];
  } catch {
    return [];
  }
}

function serializeOrder(order: {
  items: Array<{
    id: string;
    pizzaId: string;
    quantity: number;
    size: string;
    toppings: string;
    price: number;
    pizza: { name: string; image: string };
  }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string | null;
  customerCity: string | null;
  total: number;
} & Record<string, unknown>) {
  return {
    ...order,
    totalAmount: order.total,
    customer: {
      fullName: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      address: order.customerAddress || "Address not provided",
      city: order.customerCity || undefined,
    },
    items: order.items.map((item) => ({
      id: item.id,
      pizzaId: item.pizzaId,
      name: item.pizza.name,
      image: item.pizza.image,
      quantity: item.quantity,
      size: item.size,
      toppings: parseToppings(item.toppings),
      price: item.price,
    })),
  };
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("limit") || "10", 10) || 10));
  const where: Prisma.OrderWhereInput = user.role === "ADMIN" ? {} : { userId: user.id };

  if (query && user.role === "ADMIN") {
    where.OR = [
      { id: { contains: query, mode: "insensitive" } },
      { customerName: { contains: query, mode: "insensitive" } },
      { customerEmail: { contains: query, mode: "insensitive" } },
    ];
  }
  if (status && status !== "All") where.status = status;
  if (paymentMethod && paymentMethod !== "All") where.paymentMethod = paymentMethod;

  try {
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { items: { include: { pizza: { select: { name: true, image: true } } } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => serializeOrder(order)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    const values = orderSchema.parse(await request.json());
    const pizzaIds = [...new Set(values.items.map((item) => item.pizzaId))];
    const pizzas = await prisma.pizza.findMany({
      where: { id: { in: pizzaIds }, available: true },
      select: { id: true },
    });
    if (pizzas.length !== pizzaIds.length) {
      return NextResponse.json({ success: false, error: "One or more pizzas are unavailable" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
        customerCity: values.customerCity,
        notes: values.notes,
        paymentMethod: values.paymentMethod,
        paymentStatus: values.paymentMethod === "Cash on Delivery" ? "Unpaid" : "Paid",
        total: values.totalAmount,
        items: {
          create: values.items.map((item) => ({
            pizzaId: item.pizzaId,
            quantity: item.quantity,
            size: item.size,
            toppings: JSON.stringify(item.toppings),
            price: item.price,
          })),
        },
      },
      include: { items: { include: { pizza: { select: { name: true, image: true } } } } },
    });

    return NextResponse.json({ success: true, order: serializeOrder(order) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to create order" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if ((await getSessionUser())?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id, ...values } = z.object({ id: z.string().min(1) }).and(orderUpdateSchema).parse(await request.json());
    const existing = await prisma.order.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    const order = await prisma.order.update({ where: { id }, data: values });
    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Unable to update order" }, { status: 500 });
  }
}
