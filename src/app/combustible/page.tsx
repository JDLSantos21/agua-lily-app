import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FuelDashboard } from "./components/fuel-dashboard";

export default function Combustible() {
  return (
    <ProtectedRoute requiredRole="operador">
      <main className="flex-1 overflow-x-hidden max-h-[80%] overflow-y-auto">
        <FuelDashboard />
      </main>
    </ProtectedRoute>
  );
}
