import { format as formatDate } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale";

export function formatDateToUTC(
  dateString?: string | Date | null,
  formatStr = "dd MMMM yyyy"
) {
  if (!dateString) return null;

  try {
    const zonedDate = toZonedTime(dateString, "UTC");
    const finalDate = formatDate(zonedDate, formatStr, { locale: es });
    return finalDate;
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return null;
  }
}

// Nueva función para convertir fecha ISO string a Date object
export function parseDateFromISO(
  dateString?: string | Date | null
): Date | undefined {
  if (!dateString) return undefined;

  try {
    // Si ya es un objeto Date, lo retornamos directamente
    if (dateString instanceof Date) {
      return dateString;
    }

    // Si es un string ISO, lo convertimos a Date
    const date = new Date(dateString);

    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return undefined;
    }

    return date;
  } catch (error) {
    console.log("Error parseando fecha:", error);
    return undefined;
  }
}
