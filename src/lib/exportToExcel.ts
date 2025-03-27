// lib/exportToExcel.ts
import { FuelRecords } from "@/types/fuel.types";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { format } from "@formkit/tempo";

export const exportToExcel = async (fuelRecords: FuelRecords | null) => {
  if (fuelRecords === null || fuelRecords.length === 0) {
    toast.error("No hay datos para exportar");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(
    fuelRecords.map((record) => ({
      Ficha: record.current_tag,
      Chofer: record.driver,
      Kilometraje: record.mileage,
      Galones: record.gallons,
      Fecha: format(record.record_date, "DD/MM/YYYY HH:mm:ss"),
    }))
  );

  // Generar el nombre por defecto del archivo
  const defaultFilename = `REG_COMB_${format(
    new Date(),
    "YYYYMMDD_HHmmss"
  )}.xlsx`;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ConsultaCombustible");

  // Generar el archivo como un buffer binario
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  try {
    // Abrir el diálogo de guardado con el nombre por defecto y filtro para .xlsx
    const filePath = await save({
      defaultPath: defaultFilename,
      filters: [
        {
          name: "Archivo Excel",
          extensions: ["xlsx"],
        },
      ],
    });

    // Si el usuario cancela el diálogo, filePath será null
    if (!filePath) {
      toast.info("Exportación cancelada");
      return;
    }

    // Guardar el archivo en la ruta seleccionada
    await writeFile(filePath, new Uint8Array(excelBuffer));
    toast.success(`Datos exportados correctamente a ${filePath}`);
  } catch (error) {
    toast.error(
      "Error al guardar el archivo: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
};
