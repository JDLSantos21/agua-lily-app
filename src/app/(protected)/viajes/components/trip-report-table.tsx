"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, Truck, BarChart3 } from "lucide-react";
import { TripReportTableProps } from "../types/trips";
import { processTripData, calculateTotals } from "../utils/processTripData";
import TripDateChangeModal from "./TripDateChangeModal";
import SingleVehicleTable from "./single-vehicle-table";
import MultiVehicleTable from "./multi-vehicle-table";
import { exportTripsToExcel } from "../utils/excelExporter";

/**
 * Main component for displaying trip report data
 */
export default function TripReportTable({
  data,
  singleVehicleMode,
  onExport,
}: TripReportTableProps) {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isDateChangeModalOpen, setIsDateChangeModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Process the API data
  const processedData = useMemo(() => processTripData(data), [data]);

  // Calculate general totals
  const totals = useMemo(() => calculateTotals(processedData), [processedData]);

  // Function to export to Excel
  const handleExportToExcel = useCallback(async () => {
    await exportTripsToExcel(processedData, singleVehicleMode, onExport);
  }, [processedData, singleVehicleMode, onExport]);

  // Handle opening the date change modal
  const handleOpenDateChangeModal = useCallback(
    (tripId: number, currentDate: string) => {
      setSelectedTripId(tripId);
      setSelectedDate(currentDate);
      setIsDateChangeModalOpen(true);
    },
    []
  );

  // If there's no data, don't show anything
  if (processedData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin datos disponibles
          </h3>
          <p className="text-gray-500">
            No hay información de viajes para mostrar en este momento.
          </p>
        </div>
      </div>
    );
  }

  // Render table for a single vehicle
  if (singleVehicleMode && processedData.length === 1) {
    const vehicle = processedData[0];

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Truck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Reporte del Vehículo
                  <Badge variant="standardTrip" className="text-base px-3 py-1">
                    {vehicle.vehicleTag}
                  </Badge>
                </h2>
                <p className="text-gray-600 mt-1">
                  Detalle completo de viajes y transacciones
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleExportToExcel}
              className="flex items-center gap-2 h-11 px-6 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        <SingleVehicleTable
          vehicle={vehicle}
          onConduceClick={handleOpenDateChangeModal}
        />

        {isDateChangeModalOpen && selectedTripId && (
          <TripDateChangeModal
            isOpen={isDateChangeModalOpen}
            onClose={() => setIsDateChangeModalOpen(false)}
            tripId={selectedTripId}
            currentDate={selectedDate}
          />
        )}
      </div>
    );
  }

  // Render table for multiple vehicles
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Reporte General de Viajes
              </h2>
              <p className="text-gray-600 mt-1">
                Resumen consolidado de todos los vehículos
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            className="flex items-center gap-2 h-11 px-6 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <MultiVehicleTable vehicles={processedData} totals={totals} />
    </div>
  );
}
