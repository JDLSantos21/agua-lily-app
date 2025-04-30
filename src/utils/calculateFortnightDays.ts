import { format } from "@formkit/tempo";

interface FortnightDates {
  start_date: string;
  end_date: string;
}

export function calculateFortnightDates(
  year: string,
  month: string,
  fortnight: "primera" | "segunda"
): FortnightDates {
  const yearInt = parseInt(year, 10);
  const monthInt = parseInt(month, 10);

  let startDate: Date;
  let endDate: Date;

  if (fortnight === "primera") {
    // Para la primera quincena: desde el 26 del mes anterior hasta el 10 del mes actual.
    let prevYear = yearInt;
    let prevMonth = monthInt - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    // Nota: en el constructor de Date, el mes se pasa de 0 a 11.
    startDate = new Date(prevYear, prevMonth - 1, 26);
    endDate = new Date(yearInt, monthInt - 1, 10);
  } else {
    // Segunda quincena: desde el 11 al 25 del mes actual.
    startDate = new Date(yearInt, monthInt - 1, 11);
    endDate = new Date(yearInt, monthInt - 1, 25);
  }

  const start_date = format(startDate, "YYYY-MM-DD");
  const end_date = format(endDate, "YYYY-MM-DD");

  return {
    start_date,
    end_date,
  };
}
