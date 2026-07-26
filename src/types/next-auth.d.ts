import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "USER" | "ADMIN";
      phone?: string;
      address?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "ADMIN";
    phone?: string;
    address?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN";
    phone?: string;
    address?: string;
  }
}
