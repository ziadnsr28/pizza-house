/**
 * User & Authentication Data Types
 *
 * What it does:
 * Defines centralized TypeScript interfaces and types for user accounts,
 * registration data, login credentials, and user profiles with role support.
 *
 * Where it belongs:
 * src/types/user.ts
 */

/** User Profile Information (no passwords stored) */
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role?: "admin" | "user";
  createdAt: string;
}

/** Editable User Profile Data */
export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role?: "admin" | "user";
}

/** Login Credentials Form Input */
export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

/** Registration Form Input */
export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  confirmPassword?: string;
}
