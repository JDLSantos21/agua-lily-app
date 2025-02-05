"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBased } from "@/components/RoleBased";

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole="operador">
      <div>
        <h1>Dashboard</h1>
      </div>

      {/* Panel de Administrador */}
      <RoleBased allowedRoles={["admin"]}>
        <div>
          <h2>Panel de Administrador</h2>
        </div>
      </RoleBased>

      {/* Panel de Operador */}
      <RoleBased allowedRoles={["operador"]}>
        <div>
          <h2>Panel de Operador</h2>
        </div>
      </RoleBased>
    </ProtectedRoute>
  );
}
