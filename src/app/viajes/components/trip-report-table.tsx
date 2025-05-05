"use client";

import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiFileExcel2Line } from "react-icons/ri";
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
      <div className="text-center py-8">
        No hay datos disponibles para mostrar
      </div>
    );
  }

  // Render table for a single vehicle
  if (singleVehicleMode && processedData.length === 1) {
    const vehicle = processedData[0];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-lg">
            <span>Vehículo</span>
            <Badge variant="standardTrip">{vehicle.vehicleTag}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToExcel}
              className="flex items-center gap-1"
            >
              <RiFileExcel2Line className="h-4 w-4" />
              Exportar a Excel
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Viajes de todos los vehículos</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportToExcel}
          className="flex items-center gap-1"
        >
          <RiFileExcel2Line className="h-4 w-4" />
          Exportar a Excel
        </Button>
      </div>

      <MultiVehicleTable vehicles={processedData} totals={totals} />
    </div>
  );
}
