"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { LoaderSpin } from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { token, role, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return; // Esperar a que se inicialice la autenticación

    if (!token) {
      router.replace("/"); // Redirigir al login si no hay token
    } else if (requiredRole && !hasAccess(role, requiredRole)) {
      router.replace("/access-denied"); // Redirigir si el rol no tiene acceso
    }
  }, [token, role, requiredRole, router, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderSpin text="Cargando" />
      </div>
    );
  }

  // No renderizar nada si el usuario no tiene acceso
  if (!token || (requiredRole && !hasAccess(role, requiredRole))) {
    return null;
  }

  return <>{children}</>;
};

// Mover la jerarquía de roles fuera para reutilizarla
const ROLE_HIERARCHY: { [key: string]: string[] } = {
  admin: ["admin", "operador", "administrativo"], // El admin tiene acceso a las rutas de admin y operador
  operador: ["operador"], // El operador solo tiene acceso a sus propias rutas
  administrativo: ["administrativo", "operador"],
};

// Función para verificar si un rol tiene acceso a una ruta
const hasAccess = (userRole: string | null, requiredRole: string): boolean =>
  userRole ? ROLE_HIERARCHY[userRole]?.includes(requiredRole) ?? false : false;
