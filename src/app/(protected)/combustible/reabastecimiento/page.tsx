// app/combustible/reabastecimiento/page.tsx
import { Suspense } from "react";
import ReplenishmentTable from "./components/replenishment-table";
import ReplenishmentChart from "./components/replenishment-chart";
import {
  ReplenishmentChartSkeleton,
  ReplenishmentTableSkeleton,
} from "./components/skeletons";

export default function ReplenishmentPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tabla de reabastecimientos */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Reabastecimientos Recientes
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Historial de los últimos reabastecimientos realizados
              </p>
            </div>
            <div className="p-6">
              <Suspense fallback={<ReplenishmentTableSkeleton />}>
                <ReplenishmentTable />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Gráfico de reabastecimientos */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Tendencia Mensual
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Galones reabastecidos por mes
              </p>
            </div>
            <div className="p-6">
              <Suspense fallback={<ReplenishmentChartSkeleton />}>
                <ReplenishmentChart />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
