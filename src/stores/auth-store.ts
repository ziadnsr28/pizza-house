/**
 * Authentication Zustand Store
 *
 * What it does:
 * Manages user authentication session, login, registration, logout,
 * and profile updates with persistent localStorage storage and document cookie
 * flag for Next.js middleware protection.
 *
 * Security:
 * Stores ONLY public profile details (id, fullName, email, phone, address).
 * Passwords are NEVER stored in state or persistence.
 *
 * Where it belongs:
 * src/stores/auth-store.ts
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserProfile } from "@/types/user";

/** Set lightweight authentication cookie for Next.js middleware */
export function setAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "pizza_house_auth=true; path=/; max-age=2592000; SameSite=Lax";
  }
}

/** Remove authentication cookie on logout */
export function removeAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "pizza_house_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, fullName?: string) => void;
  register: (userData: Omit<User, "id" | "createdAt">) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

/** Pre-populated default user for easy demo testing */
const DEFAULT_DEMO_USER: User = {
  id: "usr-demo-101",
  fullName: "Alex Morgan",
  email: "alex@pizzahouse.eg",
  phone: "01012345678",
  address: "Building 12, Road 9, Maadi, Cairo, Egypt",
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: DEFAULT_DEMO_USER,
      isAuthenticated: true,

      /** Login user with email */
      login: (email: string, fullName = "Valued Customer") => {
        const newUser: User = {
          id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
          fullName,
          email,
          phone: "01012345678",
          address: "Downtown, Cairo, Egypt",
          createdAt: new Date().toISOString(),
        };

        setAuthCookie();
        set({ user: newUser, isAuthenticated: true });
      },

      /** Register new user */
      register: (userData) => {
        const newUser: User = {
          ...userData,
          id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
        };

        setAuthCookie();
        set({ user: newUser, isAuthenticated: true });
      },

      /** Logout active user session */
      logout: () => {
        removeAuthCookie();
        set({ user: null, isAuthenticated: false });
      },

      /** Update profile info */
      updateProfile: (profileData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...profileData } : null,
        }));
      },
    }),
    {
      name: "pizza-house-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.isAuthenticated) {
            setAuthCookie();
          }
        };
      },
    }
  )
);
