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
    return formatDate(zonedDate, formatStr, { locale: es });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return null;
  }
}
