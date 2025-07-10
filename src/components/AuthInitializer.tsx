"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
}
