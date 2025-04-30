"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiFileExcel2Fill, RiFileExcel2Line } from "react-icons/ri";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExcelJS from "exceljs";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";
import { formatToDop } from "@/utils/formatCurrency";
import { format } from "@formkit/tempo";
import { open as tauriOpen } from "@tauri-apps/plugin-shell";
import TripDateChangeModal from "./TripDateChangeModal";

// Types for API data
interface TripData {
  concept: string;
  driver: string;
  driver_id: number;
  trip_count: number;
  total_amount: number;
  trip_ids: number[];
}

interface DayTrips {
  [key: string]: TripData;
}

interface VehicleTrips {
  vehicle_id: number;
  vehicle_tag: string;
  trips_by_day: {
    [date: string]: DayTrips;
  };
}

interface ApiResponse {
  [vehicleId: string]: VehicleTrips;
}

// Types for processed data
interface DailyTripSummary {
  day: Date;
  dayStr: string;
  conduces: number[];
  concept: string;
  driver: string;
  tripCount: number;
  totalAmount: number;
}

interface VehicleSummary {
  vehicleId: number;
  vehicleTag: string;
  totalTrips: number;
  totalAmount: number;
  standardTrips: number;
  quickTrips: number;
  commissionTrips: number;
  dailyTrips: DailyTripSummary[];
}

interface TripReportTableProps {
  data: ApiResponse;
  singleVehicleMode: boolean;
  onExport?: () => void;
}

export default function TripReportTable({
  data,
  singleVehicleMode,
  onExport,
}: TripReportTableProps) {
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isDateChangeModalOpen, setIsDateChangeModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Process the API data
  const processedData = useMemo(() => {
    const vehicleSummaries: VehicleSummary[] = [];

    // Iterate over each vehicle in the response
    Object.values(data).forEach((vehicleData) => {
      const vehicleSummary: VehicleSummary = {
        vehicleId: vehicleData.vehicle_id,
        vehicleTag: vehicleData.vehicle_tag,
        totalTrips: 0,
        totalAmount: 0,
        standardTrips: 0,
        quickTrips: 0,
        commissionTrips: 0,
        dailyTrips: [],
      };

      // Process trips by day
      Object.entries(vehicleData.trips_by_day).forEach(
        ([dateStr, dayTrips]) => {
          const date = new Date(dateStr);

          // Process each group of trips (by concept and driver)
          Object.entries(dayTrips).forEach(([_, tripData]) => {
            const dailySummary: DailyTripSummary = {
              day: date,
              dayStr: dateStr,
              conduces: tripData.trip_ids,
              concept: tripData.concept,
              driver: tripData.driver,
              tripCount: tripData.trip_count,
              totalAmount: tripData.total_amount,
            };

            // Update vehicle totals
            vehicleSummary.totalTrips += tripData.trip_count;
            vehicleSummary.totalAmount += tripData.total_amount;

            // Count by trip type for the vehicle
            if (tripData.concept === "Viaje Estándar") {
              vehicleSummary.standardTrips += tripData.trip_count;
            } else if (tripData.concept === "Viaje Rapido") {
              vehicleSummary.quickTrips += tripData.trip_count;
            } else if (tripData.concept === "Comisión por ventas") {
              vehicleSummary.commissionTrips += tripData.trip_count;
            }

            // Add the daily summary to the list
            vehicleSummary.dailyTrips.push(dailySummary);
          });
        }
      );

      // Add the vehicle summary to the list
      vehicleSummaries.push(vehicleSummary);
    });

    return vehicleSummaries;
  }, [data]);

  // Calculate general totals
  const totals = useMemo(() => {
    return processedData.reduce(
      (acc, vehicle) => {
        return {
          totalTrips: acc.totalTrips + vehicle.totalTrips,
          totalAmount: acc.totalAmount + vehicle.totalAmount,
        };
      },
      { totalTrips: 0, totalAmount: 0 }
    );
  }, [processedData]);

  // Function to export to Excel
  const exportToExcel = async () => {
    if (onExport) {
      onExport();
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const borderStyle = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      const createStyledSheet = (sheet: any, data: any) => {
        const headerRow = sheet.addRow(Object.keys(data[0]));

        // Header styles
        headerRow.eachCell((cell: any) => {
          cell.font = { bold: true, color: { argb: "ffffff" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "1562fb" },
          };
          cell.border = borderStyle;
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });

        // Data
        data.forEach((rowObj: any) => {
          const row = sheet.addRow(Object.values(rowObj));
          row.eachCell((cell: any) => {
            const isTotalRow =
              rowObj.Fecha === "TOTAL" || rowObj.Vehículo === "TOTAL";
            if (isTotalRow) {
              cell.font = { bold: true };
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "eeece1" },
              };
            }
            cell.border = borderStyle;
          });
        });

        sheet.columns.forEach((column: any) => {
          column.width = 20;
        });
      };

      if (singleVehicleMode && processedData.length === 1) {
        const vehicle = processedData[0];

        const dataToExport = vehicle.dailyTrips.map((day) => ({
          Fecha: format(day.day, "DD/MM/YYYY"),
          Conduces: day.conduces.join(", "),
          Concepto: day.concept,
          Conductor: day.driver,
          Cantidad: day.tripCount,
          Total: day.totalAmount,
        }));

        dataToExport.push({
          Fecha: "TOTAL",
          Conduces: "",
          Concepto: "",
          Conductor: "",
          Cantidad: vehicle.totalTrips,
          Total: vehicle.totalAmount,
        });

        const sheet = workbook.addWorksheet(`Vehículo ${vehicle.vehicleTag}`);
        createStyledSheet(sheet, dataToExport);
      } else {
        // Export multiple vehicles
        processedData.forEach((vehicle) => {
          const dataToExport = vehicle.dailyTrips.map((day) => ({
            Fecha: format(day.day, "DD/MM/YYYY"),
            Conduces: day.conduces.join(", "),
            Concepto: day.concept,
            Conductor: day.driver,
            Cantidad: day.tripCount,
            Total: day.totalAmount,
          }));

          dataToExport.push({
            Fecha: "TOTAL",
            Conduces: "",
            Concepto: "",
            Conductor: "",
            Cantidad: vehicle.totalTrips,
            Total: vehicle.totalAmount,
          });

          const sheet = workbook.addWorksheet(
            `${vehicle.vehicleTag}`.slice(0, 31)
          );
          createStyledSheet(sheet, dataToExport);
        });

        // Summary sheet
        const summaryData = processedData.map((vehicle) => ({
          Vehículo: vehicle.vehicleTag,
          "Viajes Estándar": vehicle.standardTrips,
          "Viajes Rápidos": vehicle.quickTrips,
          "Comisión por ventas": vehicle.commissionTrips,
          "Total Viajes": vehicle.totalTrips,
          "Total a Pagar": vehicle.totalAmount,
        }));

        summaryData.push({
          Vehículo: "TOTAL",
          "Viajes Estándar": processedData.reduce(
            (sum, v) => sum + v.standardTrips,
            0
          ),
          "Viajes Rápidos": processedData.reduce(
            (sum, v) => sum + v.quickTrips,
            0
          ),
          "Comisión por ventas": processedData.reduce(
            (sum, v) => sum + v.commissionTrips,
            0
          ),
          "Total Viajes": totals.totalTrips,
          "Total a Pagar": totals.totalAmount,
        });

        const summarySheet = workbook.addWorksheet("Resumen");
        createStyledSheet(summarySheet, summaryData);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileName = `Reporte_${processedData.length === 1 ? "Vehiculo" : "Todos_Vehiculos"}_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Open save dialog with Tauri
      const filePath = await save({
        defaultPath: fileName,
        filters: [
          {
            name: "Excel",
            extensions: ["xlsx"],
          },
        ],
      });

      if (!filePath) {
        toast.info("Exportación cancelada");
        return;
      }

      // Save the file using Tauri
      const arrayBuffer = await blob.arrayBuffer();
      await writeFile(filePath, new Uint8Array(arrayBuffer));

      const folderName = filePath.split("\\")[filePath.split("\\").length - 2];

      toast(`Archivo guardado`, {
        description: `En la carpeta ${folderName}`,
        icon: <RiFileExcel2Fill className="h-5 w-5 mr-10 text-green-600" />,
        closeButton: true,
        actionButtonStyle: {
          backgroundColor: "#1562fb",
          color: "white",
        },
        action: {
          label: "Abrir Excel",
          onClick: () => {
            tauriOpen(filePath);
          },
        },
        duration: Infinity,
      });
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      toast.error("Error al exportar a Excel");
    }
  };

  const handleOpenDateChangeModal = (tripId: number, currentDate: string) => {
    setSelectedTripId(tripId);
    setSelectedDate(currentDate);
    setIsDateChangeModalOpen(true);
  };

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
              onClick={exportToExcel}
              className="flex items-center gap-1"
            >
              <RiFileExcel2Line className="h-4 w-4" />
              Exportar a Excel
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] font-bold">Fecha</TableHead>
                <TableHead className="font-bold">Conduces</TableHead>
                <TableHead className="font-bold">Concepto</TableHead>
                <TableHead className="font-bold">Conductor</TableHead>
                <TableHead className="font-bold text-center">
                  Cantidad
                </TableHead>
                <TableHead className="font-bold text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicle.dailyTrips.map((day) => (
                <TableRow key={`${day.dayStr}-${day.concept}-${day.driver}`}>
                  <TableCell className="font-medium">
                    {format(day.day, "DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {day.conduces.map((conduceId) => (
                        <Badge
                          key={conduceId}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() =>
                            handleOpenDateChangeModal(
                              conduceId,
                              format(day.day, "YYYY-MM-DD")
                            )
                          }
                        >
                          #{conduceId}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        day.concept === "Viaje Estándar"
                          ? "standardTrip"
                          : day.concept === "Viaje Rapido"
                            ? "quickTrip"
                            : "comissionTrip"
                      }
                    >
                      {day.tripCount}
                    </Badge>{" "}
                    {day.concept}
                  </TableCell>
                  <TableCell>{day.driver}</TableCell>
                  <TableCell className="text-center">{day.tripCount}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatToDop(day.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Totals row */}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={4} className="font-bold">
                  TOTALES
                </TableCell>
                <TableCell className="text-center font-bold">
                  {vehicle.totalTrips}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatToDop(vehicle.totalAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

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
          onClick={exportToExcel}
          className="flex items-center gap-1"
        >
          <RiFileExcel2Line className="h-4 w-4" />
          Exportar a Excel
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Vehículo</TableHead>
              <TableHead className="font-bold text-center">
                Viajes Estándar
              </TableHead>
              <TableHead className="font-bold text-center">
                Viajes Rápidos
              </TableHead>
              <TableHead className="font-bold text-center">
                Comisión por ventas
              </TableHead>
              <TableHead className="font-bold text-center">
                Total Viajes
              </TableHead>
              <TableHead className="font-bold text-right">
                Total a Pagar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((vehicle) => (
              <TableRow key={vehicle.vehicleId}>
                <TableCell className="font-medium">
                  {vehicle.vehicleTag}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      vehicle.standardTrips !== 0 ? "standardTrip" : "outline"
                    }
                  >
                    {vehicle.standardTrips}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={vehicle.quickTrips !== 0 ? "quickTrip" : "outline"}
                  >
                    {vehicle.quickTrips}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      vehicle.commissionTrips !== 0
                        ? "comissionTrip"
                        : "outline"
                    }
                  >
                    {vehicle.commissionTrips}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {vehicle.totalTrips}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatToDop(vehicle.totalAmount)}
                </TableCell>
              </TableRow>
            ))}

            {/* Totals row */}
            <TableRow className="bg-muted/50">
              <TableCell className="font-bold">TOTALES</TableCell>
              <TableCell className="text-center font-bold">
                {processedData.reduce(
                  (sum, vehicle) => sum + vehicle.standardTrips,
                  0
                )}
              </TableCell>
              <TableCell className="text-center font-bold">
                {processedData.reduce(
                  (sum, vehicle) => sum + vehicle.quickTrips,
                  0
                )}
              </TableCell>
              <TableCell className="text-center font-bold">
                {processedData.reduce(
                  (sum, vehicle) => sum + vehicle.commissionTrips,
                  0
                )}
              </TableCell>
              <TableCell className="text-center font-bold">
                {totals.totalTrips}
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatToDop(totals.totalAmount)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
