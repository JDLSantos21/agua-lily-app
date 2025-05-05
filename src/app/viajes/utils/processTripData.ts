import {
  ApiResponse,
  VehicleSummary,
  TripTotals,
  ExcelRow,
  SummaryExcelRow,
} from "../types/trips";
import { format, tzDate } from "@formkit/tempo";
import ExcelJS from "exceljs";

/**
 * Process the API data into a more usable format for the UI
 */
export const processTripData = (data: ApiResponse): VehicleSummary[] => {
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
    Object.entries(vehicleData.trips_by_day).forEach(([dateStr, dayTrips]) => {
      const date = new Date(dateStr);

      console.log("dateString: ", dateStr);
      console.log("date: ", date);

      // Process each group of trips (by concept and driver)
      Object.entries(dayTrips).forEach(([_, tripData]) => {
        const dailySummary = {
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
    });

    // Add the vehicle summary to the list
    vehicleSummaries.push(vehicleSummary);
  });

  return vehicleSummaries;
};

/**
 * Calculate totals from processed data
 */
export const calculateTotals = (
  processedData: VehicleSummary[]
): TripTotals => {
  return processedData.reduce(
    (acc, vehicle) => {
      return {
        totalTrips: acc.totalTrips + vehicle.totalTrips,
        totalAmount: acc.totalAmount + vehicle.totalAmount,
      };
    },
    { totalTrips: 0, totalAmount: 0 }
  );
};

/**
 * Apply Excel styling to a worksheet
 */
export const applyExcelStyling = (
  sheet: ExcelJS.Worksheet,
  data: ExcelRow[] | SummaryExcelRow[]
) => {
  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: "thin" as ExcelJS.BorderStyle },
    left: { style: "thin" as ExcelJS.BorderStyle },
    bottom: { style: "thin" as ExcelJS.BorderStyle },
    right: { style: "thin" as ExcelJS.BorderStyle },
  };

  const headerRow = sheet.addRow(Object.keys(data[0]));

  // Header styles
  headerRow.eachCell((cell) => {
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
  data.forEach((rowObj) => {
    const row = sheet.addRow(Object.values(rowObj));
    row.eachCell((cell) => {
      const isTotalRow =
        (rowObj as ExcelRow).Fecha === "TOTAL" ||
        (rowObj as SummaryExcelRow).Vehículo === "TOTAL";

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

  sheet.columns.forEach((column) => {
    column.width = 20;
  });
};

/**
 * Prepare single vehicle data for Excel export
 */
export const prepareSingleVehicleExcelData = (
  vehicle: VehicleSummary
): ExcelRow[] => {
  console.log("vehicle: ", vehicle);
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

  return dataToExport;
};

/**
 * Prepare summary data for multi-vehicle Excel export
 */
export const prepareSummaryExcelData = (
  processedData: VehicleSummary[]
): SummaryExcelRow[] => {
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
    "Viajes Rápidos": processedData.reduce((sum, v) => sum + v.quickTrips, 0),
    "Comisión por ventas": processedData.reduce(
      (sum, v) => sum + v.commissionTrips,
      0
    ),
    "Total Viajes": processedData.reduce((sum, v) => sum + v.totalTrips, 0),
    "Total a Pagar": processedData.reduce((sum, v) => sum + v.totalAmount, 0),
  });

  return summaryData;
};
