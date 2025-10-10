"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderSpin } from "@/components/Loader";
import { useAuthStore } from "@/stores/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Inicializar autenticación si no se ha hecho
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    const checkAuth = async () => {
      try {
        if (!isAuthenticated()) {
          console.log("Usuario no autenticado, redirigiendo a login");
          router.replace("/login");
          return;
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isInitialized, isAuthenticated, router]);

  // Mostrar loader mientras se inicializa o verifica
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpin text="Verificando sesión..." />
      </div>
    );
  }

  // Solo renderizar children si está autenticado
  return isAuthenticated() ? <>{children}</> : null;
}
