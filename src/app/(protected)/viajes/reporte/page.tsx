"use client";

import TripsFilter from "../components/trips-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripStore } from "@/stores/tripStore";
import TripReportTable from "../components/trip-report-table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FileSearch,
  Info,
  Loader2,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useTripReports } from "@/hooks/useTripReports";

export default function ReporteViajes() {
  const { activeFilters, showResults, resetReportState } = useTripStore();

  const {
    data: trips,
    isLoading,
    error,
    isSuccess,
  } = useTripReports(activeFilters || undefined);

  const handleNewSearch = () => {
    resetReportState();
  };

  return (
    <div className="min-h-screen">
      {/* Filter Section */}
      <div
        className={`transition-all duration-300 ${showResults ? "hidden" : "block"}`}
      >
        <TripsFilter />
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Loading Header */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Generando Reporte
                    </h3>
                    <p className="text-sm text-gray-500">
                      Por favor espera mientras procesamos los datos...
                    </p>
                  </div>
                </div>

                {/* Loading Skeletons */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-red-100 shadow-sm p-8"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error al cargar los datos
                </h3>
                <p className="text-gray-600 mb-6">
                  {error.message ||
                    "Ocurrió un error inesperado al procesar tu solicitud"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleNewSearch}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Intentar nueva búsqueda
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State with Data */}
          {trips && Object.values(trips).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Action Bar */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleNewSearch}
                  className="flex items-center gap-2 h-11 px-6"
                >
                  <FileSearch className="h-4 w-4" />
                  Nueva búsqueda
                </Button>
              </div>

              {/* Report Table */}
              <TripReportTable
                data={trips}
                singleVehicleMode={!!activeFilters?.vehicle_id}
              />
            </motion.div>
          )}

          {/* No Results State */}
          {isSuccess && Object.values(trips).length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-8"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sin resultados
                </h3>
                <p className="text-gray-600 mb-6">
                  No se encontraron viajes que coincidan con los filtros
                  seleccionados
                </p>
                <Button
                  variant="outline"
                  onClick={handleNewSearch}
                  className="flex items-center gap-2"
                >
                  <FileSearch className="h-4 w-4" />
                  Realizar nueva búsqueda
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Initial State Info */}
      {!showResults && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto bg-white rounded-xl border border-blue-100 shadow-sm p-8">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Info className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Comienza tu búsqueda!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configura los filtros de arriba para generar reportes detallados
                de los viajes realizados por tus vehículos.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
