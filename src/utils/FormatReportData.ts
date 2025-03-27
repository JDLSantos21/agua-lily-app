import { format } from "@formkit/tempo";
import { toast } from "sonner";
import { InventoryMovement } from "@/types/inventory";

interface FormatReportData {
  records: InventoryMovement[] | null;
  date: string;
  fileName: string;
  type: "user" | "day";
  userName: string | null;
  reportNumber: string;
}

export const FormatReportData = (
  inventoryRecords: InventoryMovement[] | null,
  selectedUser: string | null,
  selectedDate?: string
): FormatReportData => {
  if (!inventoryRecords || inventoryRecords.length === 0) {
    toast.error("No hay datos para exportar");
    return {
      records: null,
      date: "",
      fileName: "",
      type: "day",
      userName: "",
      reportNumber: "",
    };
  }

  const records = inventoryRecords;
  let reportType: "user" | "day" = "user";
  const userName = selectedUser;
  const reportNumber = format(new Date(), "YYYYMMDDHHmmss");

  if (!selectedUser) {
    reportType = "day";
  }

  const date = selectedDate || "No hay fecha";

  const fileName = `INV_${
    reportType === "user" ? selectedUser?.replace(/\s/g, "_") : "DIA"
  }_${format(new Date(), "YYYYMMDD_HHmmss")}.pdf`;

  return { records, date, fileName, userName, type: reportType, reportNumber };
};
