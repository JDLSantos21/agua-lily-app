"use client";

import { useAuthStore } from "@/stores/authStore";

// Componente reutilizable para mostrar contenido según roles permitidos
interface RoleBasedProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleBased = ({ allowedRoles, children }: RoleBasedProps) => {
  const { role } = useAuthStore(); // Obtener el rol del usuario

  if (!role || !allowedRoles.includes(role)) return null; // Ocultar si el rol no tiene permiso

  return <>{children}</>;
};
