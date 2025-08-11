import { createLabel, printLabel } from "qikpos";
import { format } from "@formkit/tempo";
import { formatDate } from "date-fns";
import { Equipment } from "@/types/equipments.types";

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

    return await printLabel(label, "http://localhost:30080");
  }
  async printEquipmentLabel(
    equipment: Equipment,
    quantity: number = 1
  ): Promise<{ success: boolean; message: string }> {
    const label = createLabel(4, 2, 300);
    label
      .line(0, 210, 1200, 210, 3)
      .text({
        value: "AGUA & HIELO LILY",
        x: 185,
        y: 12,
        fontSize: 45,
      }) // Texto principal
      .text({
        value: "LA NATURALEZA EN TU CASA",
        x: 192,
        y: 55,
        fontSize: 25,
      })
      .line(600, 0, 600, 210, 3)
      .line(540, 210, 540, 600, 3)
      .line(900, 210, 900, 600, 3)
      .line(0, 425, 540, 425, 3)
      .text({
        value: "INDICACIONES",
        x: 620,
        y: 12,
        fontSize: 25,
      })
      .text({
        value:
          "Lorem Ipsum generated asdjasjdaksd asjdahsdjasdhask ashdhasdas hasdjajdkas ahsdasjadk",
        x: 620,
        y: 40,
        fontSize: 20,
      })
      .text({
        value:
          "Lorem Ipsum generated asdjasjdaksd asjdahsdjasdhask ashdhasdas hasdjajdkas ahsdasjadk",
        x: 620,
        y: 65,
        fontSize: 20,
      })

      .text({
        value:
          "Lorem Ipsum generated asdjasjdaksd asjdahsdjasdhask ashdhasdas hasdjajdkas ahsdasjadk",
        x: 620,
        y: 90,
        fontSize: 20,
      })
      .text({
        value:
          "Lorem Ipsum generated asdjasjdaksd asjdahsdjasdhask ashdhasdas hasdjajdkas ahsdasjadk",
        x: 620,
        y: 115,
        fontSize: 20,
      })
      .text({
        value:
          "Lorem Ipsum generated asdjasjdaksd asjdahsdjasdhask ashdhasdas hasdjajdkas ahsdasjadk",
        x: 620,
        y: 90,
        fontSize: 20,
      })
      .text({
        value:
          "Lorem Ipsum generated asdjasjdaksd asjdahsdjasdhask ashdhasdas hasdjajdkas ahsdasjadk",
        x: 620,
        y: 115,
        fontSize: 20,
      })

      .text({
        value: "USO INTERNO",
        x: 960,
        y: 245,
        fontSize: 35,
      })
      .text({
        value: "ESCANEAR",
        x: 980,
        y: 285,
        fontSize: 35,
      })
      .QRCode(equipment.serial_number, 950, 330, 10)
      .text({
        value: "SERIAL",
        x: 20,
        y: 240,
        fontSize: 35,
      })
      .barcode({
        value: equipment.serial_number,
        type: "128",
        x: 20,
        y: 280,
        height: 100,
        width: 3,
      })
      .text({
        value: "PROHIBIDO REMOVER ESTA",
        x: 40,
        y: 480,
        fontSize: 40,
      })
      .text({
        value: "ETIQUETA",
        x: 150,
        y: 525,
        fontSize: 40,
      })
      .setCopies(quantity);

    return await printLabel(label);
  }
}

export const printerService = new PrinterService();
