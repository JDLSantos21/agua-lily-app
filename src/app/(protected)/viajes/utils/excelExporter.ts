import ExcelJS from "exceljs";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { open as tauriOpen } from "@tauri-apps/plugin-shell";
import { toast } from "sonner";
import { VehicleSummary } from "../types/trips";
import {
  applyExcelStyling,
  prepareSingleVehicleExcelData,
  prepareSummaryExcelData,
} from "./processTripData";

/**
 * Export trip data to Excel
 */
export const exportTripsToExcel = async (
  processedData: VehicleSummary[],
  singleVehicleMode: boolean,
  onExport?: () => void
) => {
  if (onExport) {
    onExport();
    return;
  }

  try {
    const workbook = new ExcelJS.Workbook();

    if (singleVehicleMode && processedData.length === 1) {
      await exportSingleVehicle(workbook, processedData[0]);
    } else {
      await exportMultipleVehicles(workbook, processedData);
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

/**
 * Export a single vehicle's data to Excel
 */
const exportSingleVehicle = async (
  workbook: ExcelJS.Workbook,
  vehicle: VehicleSummary
) => {
  const dataToExport = prepareSingleVehicleExcelData(vehicle);
  const sheet = workbook.addWorksheet(`Vehículo ${vehicle.vehicleTag}`);
  applyExcelStyling(sheet, dataToExport);
};

/**
 * Export multiple vehicles' data to Excel with summary sheet
 */
const exportMultipleVehicles = async (
  workbook: ExcelJS.Workbook,
  processedData: VehicleSummary[]
) => {
  // Add individual vehicle sheets
  processedData.forEach((vehicle) => {
    const dataToExport = prepareSingleVehicleExcelData(vehicle);
    const sheet = workbook.addWorksheet(`${vehicle.vehicleTag}`.slice(0, 31));
    applyExcelStyling(sheet, dataToExport);
  });

  // Add summary sheet
  const summaryData = prepareSummaryExcelData(processedData);
  const summarySheet = workbook.addWorksheet("Resumen");
  applyExcelStyling(summarySheet, summaryData);
};
