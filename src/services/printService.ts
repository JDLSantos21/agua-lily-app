import { createLabel, printLabel } from "qikpos";
import { format } from "@formkit/tempo";
import { formatDate } from "date-fns";

interface PrintLabelParams {
  sequence_number: string;
  quantity: number;
  created_at: string;
}

class PrinterService {
  async printBottleLabel(params: PrintLabelParams) {
    const { sequence_number, quantity, created_at } = params;
    const date = format(created_at, "DD/MM/YYYY");
    const time = formatDate(created_at, "hh:mm a");
    const label = createLabel(2, 1, 300);
    label
      .image("/logo.bmp", 0, 50, 210, 210)
      // .text("Llenado de Botellon", 190, 40, 35) // Texto principal
      .text({
        value: "Llenado de Botellon",
        x: 190,
        y: 40,
        fontSize: 35,
      })
      .QRCode("https://agualily.com", 430, 85, 4) // Código QR
      .text({
        value: date,
        x: 430,
        y: 210,
        fontSize: 30,
      }) // Fecha
      .text({
        value: time,
        x: 430,
        y: 245,
        fontSize: 30,
      }) // Hora
      .text({
        value: sequence_number,
        x: 230,
        y: 110,
        fontSize: 100,
      }) // Número grande
      .text({
        value: `Cant.: ${quantity}`,
        x: 230,
        y: 210,
        fontSize: 45,
      }) // Cantidad
      .setCopies(quantity);

    return await printLabel(label, "http://localhost:30081");
  }
}

export const printerService = new PrinterService();
