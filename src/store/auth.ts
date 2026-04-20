import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem("auth_token", token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },
    }),
    { name: "tawreedat-auth", partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
