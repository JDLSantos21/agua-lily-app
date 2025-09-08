import { createLabel, printLabel } from "qikpos";
import { format } from "@formkit/tempo";
import { formatDate } from "date-fns";
import { Equipment } from "@/types/equipments.types";
import {
  pxFont,
  pxX,
  pxY,
  qrMagnification,
} from "@/shared/utils/labelPrinterHelper";

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

    return await printLabel(label);
  }
  async printEquipmentLabel(
    equipment: Equipment,
    quantity: number = 1
  ): Promise<{ success: boolean; message: string }> {
    const WIDTH_INCH = 4;
    const HEIGHT_INCH = 2;
    const PRINTER_DPI = 203;

    const WIDTH_PX = WIDTH_INCH * PRINTER_DPI;
    const HEIGHT_PX = HEIGHT_INCH * PRINTER_DPI;

    const label = createLabel(WIDTH_INCH, HEIGHT_INCH, PRINTER_DPI);
    label
      // Líneas
      .line(
        pxX(60, WIDTH_PX),
        pxY(0, HEIGHT_PX),
        pxX(60, WIDTH_PX),
        pxY(100, HEIGHT_PX),
        2
      ) // Vertical ~720/1200 → 60%
      .line(
        pxX(0, WIDTH_PX),
        pxY(75, HEIGHT_PX),
        pxX(60, WIDTH_PX),
        pxY(75, HEIGHT_PX),
        2
      ) // Horizontal ~450/600 → 75%
      .line(
        pxX(0, WIDTH_PX),
        pxY(40, HEIGHT_PX),
        pxX(60, WIDTH_PX),
        pxY(40, HEIGHT_PX),
        2
      ) // Horizontal ~240/600 → 40%
      .image(
        "/logo.bmp",
        pxX(1, WIDTH_PX),
        pxY(2, HEIGHT_PX),
        pxX(20, WIDTH_PX),
        pxY(38, HEIGHT_PX)
      ) // Logo 240x180
      .image(
        "/warning.png",
        pxX(1, WIDTH_PX),
        pxY(79, HEIGHT_PX),
        pxX(11, WIDTH_PX),
        pxY(20, HEIGHT_PX)
      ) // Logo 240x180

      // Textos
      .text({
        value: "AGUA & HIELO LILY",
        x: pxX(22, WIDTH_PX), // 270/1200 ≈ 22.5%
        y: pxY(6, HEIGHT_PX), // 20/600 ≈ 3.3%
        fontSize: pxFont(8, HEIGHT_PX), // 50/600 ≈ 8.3% → redondeado a 12% para mejor legibilidad
      })
      .text({
        value: "LA NATURALEZA EN TU CASA",
        x: pxX(27, WIDTH_PX), // 290/1200 ≈ 24.2%
        y: pxY(14, HEIGHT_PX), // 65/600 ≈ 10.8%
        fontSize: pxFont(4, HEIGHT_PX), // 30/600 ≈ 5% → subido a 7%
      })
      .text({
        value: "Tel.: +1 (809)-568-5757",
        x: pxX(22, WIDTH_PX), // 290/1200 ≈ 24.2%
        y: pxY(21, HEIGHT_PX), // 65/600 ≈ 10.8%
        fontSize: pxFont(4, HEIGHT_PX), // 30/600 ≈ 5% → subido a 7%
      })
      .text({
        value: "       +1 (809)-568-5754",
        x: pxX(22, WIDTH_PX), // 290/1200 ≈ 24.2%
        y: pxY(27, HEIGHT_PX), // 65/600 ≈ 10.8%
        fontSize: pxFont(4, HEIGHT_PX), // 30/600 ≈ 5% → subido a 7%
      })
      .text({
        value: "Web.: https://agualily.com/",
        x: pxX(22, WIDTH_PX), // 290/1200 ≈ 24.2%
        y: pxY(33, HEIGHT_PX), // 65/600 ≈ 10.8%
        fontSize: pxFont(4, HEIGHT_PX), // 30/600 ≈ 5% → subido a 7%
      })
      // QR
      .QRCode(
        equipment.serial_number,
        pxX(62, WIDTH_PX),
        pxY(12.5, HEIGHT_PX),
        qrMagnification(50, PRINTER_DPI, WIDTH_INCH)
      ) // 745/1200=62%, 75/600=12.5

      // Textos inferiores
      .text({
        value: "PROHIBIDO REMOVER",
        x: pxX(13, WIDTH_PX), // 160/1200 ≈ 13.3%
        y: pxY(80, HEIGHT_PX), // 485/600 ≈ 80.8%
        fontSize: pxFont(10, HEIGHT_PX),
      })
      .text({
        value: "ESTA ETIQUETA",
        x: pxX(20, WIDTH_PX), // 225/1200 ≈ 18.7%
        y: pxY(90, HEIGHT_PX), // 530/600 ≈ 88.3%
        fontSize: pxFont(10, HEIGHT_PX),
      })
      .text({
        value: "TIPO",
        x: pxX(4, WIDTH_PX),
        y: pxY(45, HEIGHT_PX),
        fontSize: pxFont(4, HEIGHT_PX),
      })
      .text({
        value: equipment.type?.toUpperCase(),
        x: pxX(4, WIDTH_PX),
        y: pxY(50, HEIGHT_PX),
        fontSize: pxFont(8, HEIGHT_PX),
      })
      .text({
        value: "MODELO",
        x: pxX(4, WIDTH_PX),
        y: pxY(60, HEIGHT_PX),
        fontSize: pxFont(4, HEIGHT_PX),
      })
      .text({
        value: equipment.model,
        x: pxX(4, WIDTH_PX),
        y: pxY(65, HEIGHT_PX),
        fontSize: pxFont(8, HEIGHT_PX),
      })
      .text({
        value: "CAPACIDAD",
        x: pxX(35, WIDTH_PX),
        y: pxY(45, HEIGHT_PX),
        fontSize: pxFont(4, HEIGHT_PX),
      })
      .text({
        value: `${equipment.capacity}`,
        x: pxX(35, WIDTH_PX),
        y: pxY(50, HEIGHT_PX),
        fontSize: pxFont(8, HEIGHT_PX),
      })
      .text({
        value: "FECHA",
        x: pxX(35, WIDTH_PX),
        y: pxY(60, HEIGHT_PX),
        fontSize: pxFont(4, HEIGHT_PX),
      })
      .text({
        value: `${format(equipment.created_at, "DD/MM/YYYY")}`,
        x: pxX(35, WIDTH_PX),
        y: pxY(65, HEIGHT_PX),
        fontSize: pxFont(8, HEIGHT_PX),
      })
      .setCopies(quantity);

    return await printLabel(label);
  }
}

export const printerService = new PrinterService();
