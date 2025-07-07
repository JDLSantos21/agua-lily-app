"use client";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { login, logout } = useAuthStore();

  const router = useRouter();

  const signIn = useCallback(
    async (user: string, pass: string) => {
      // await login(user, pass);
      router.replace("/");
    },
    [login, router]
  );

  const signOut = useCallback(
    async (user: string, pass: string) => {
      router.replace("/login");
      await logout();
    },
    [login, router]
  );

  return {
    signIn,
    signOut,
  };
}
