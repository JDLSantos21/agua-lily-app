"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBased } from "@/components/RoleBased";
import { InventoryReportDialog } from "../inventario/components/inventory-report-dialog";

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole="cajero">
      <div>
        <h1>Dashboard</h1>
        <InventoryReportDialog />
      </div>

      {/* <button onClick={checkForUpdates}>Check for updates</button> */}

      {/* <h1 className="font-heading text-h1 font-bold">Título Principal</h1>
      <h2 className="font-subheading text-h2 font-semibold">Subtítulo</h2>
      <p className="font-body text-base font-normal">
        Texto normal del cuerpo.
      </p>
      <span className="font-accent text-sm">Texto especial con acento</span> */}

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
