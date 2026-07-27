import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export async function PATCH(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    const values = profileSchema.parse(await request.json());
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(values.fullName ? { name: values.fullName } : {}),
        phone: values.phone,
        address: values.address,
      },
      select: { id: true, name: true, email: true, phone: true, address: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Unable to update profile" }, { status: 500 });
  }
}
