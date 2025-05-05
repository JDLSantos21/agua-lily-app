import { QIKPOS_SERVER_URL } from "@/api/config";
import { getPrinters, getSelectedPrinter } from "qikpos";
import ChangePrinterForm from "./change-printer-form";
import { updatePrinter } from "./actions";

export default async function SettingsPrintersPage() {
  const printers = await getPrinters(QIKPOS_SERVER_URL);
  const selectedPrinter = await getSelectedPrinter(QIKPOS_SERVER_URL);

  console.log(printers); // Log the printers to the console for debugging
  return (
    <div className="container mx-auto py-6 p-10">
      <h1 className="text-2xl font-bold">Configuración de Impresoras</h1>
      <p className="text-gray-600">
        Aquí puedes configurar las impresoras disponibles en la aplicación.
      </p>

      <div>
        <h2 className="text-xl font-semibold mt-6">Impresora actual:</h2>
        <p className="text-gray-600">
          {selectedPrinter.printer || "No hay impresora seleccionada"}
        </p>
      </div>

      <ChangePrinterForm
        printers={printers.printers}
        selectedPrinter={selectedPrinter.printer || ""}
        onPrinterChange={updatePrinter}
      />
    </div>
  );
}
