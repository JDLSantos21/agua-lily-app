import { createLabel, printLabel } from "qikpos";
import { format } from "@formkit/tempo";
import { formatDate } from "date-fns";

interface PrintLabelParams {
  sequence_number: string;
  quantity: number;
  date: string;
  created_at: string;
}

class PrinterService {
  async printBottleLabel(params: PrintLabelParams) {
    const { sequence_number, quantity, created_at } = params;
    const label = createLabel(2, 1, 300);
    const date = format(created_at, "DD/MM/YYYY");
    const time = formatDate(created_at, "hh:mm a");

    console.log(time);

    label
      .image("/logo.bmp", 0, 50, 210, 210)
      .text("Llenado de Botellon", 190, 40, 35) // Texto principal
      .QRCode("https://agualily.com", 430, 85, 4) // Código QR
      .text(date, 430, 210, 30) // Fecha
      .text(time, 430, 245, 30) // Hora
      .text(sequence_number, 230, 110, 100) // Número grande
      .text(`Cant.: ${quantity}`, 230, 210, 45) // Cantidad
      .setCopies(quantity);

    return await printLabel(label);
  }
}

export const printerService = new PrinterService();
