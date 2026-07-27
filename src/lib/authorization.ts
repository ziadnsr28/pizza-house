import "server-only";

import { auth } from "@/auth";

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const user = await getSessionUser();
  return user?.role === "ADMIN";
}
