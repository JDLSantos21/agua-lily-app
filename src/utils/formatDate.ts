// Importar format de date-fns (que ya tienes)
import { format, isValid, parseISO } from "date-fns";

// Función helper simple usando date-fns
export const formatDateForDB = (
  dateValue: string | Date | null | undefined
): string | undefined => {
  if (!dateValue) return undefined;

  try {
    let date: Date;

    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
      if (
        typeof dateValue === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
      ) {
        return dateValue;
      }
      date = parseISO(dateValue as string);
    }

    // Verificar que la fecha sea válida
    if (!isValid(date)) {
      return undefined;
    }

    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.warn("Error formateando fecha:", error);
    return undefined;
  }
};
