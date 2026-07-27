import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const updateOrderSchema = z.object({
  status: z.enum(["Pending", "Preparing", "Out For Delivery", "Delivered", "Cancelled"]).optional(),
  paymentStatus: z.enum(["Paid", "Unpaid", "Refunded"]).optional(),
}).refine((values) => values.status !== undefined || values.paymentStatus !== undefined, {
  message: "Provide a status or payment status",
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if ((await getSessionUser())?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Administrator access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const values = updateOrderSchema.parse(await request.json());
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
