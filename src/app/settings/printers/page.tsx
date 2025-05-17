"use client";

import { useEffect, useState } from "react";
import ChangePrinterForm from "./change-printer-form";
import QikPOS from "qikpos";

export default function SettingsPrintersPage() {
  const [loading, setLoading] = useState(true);
  const [printers, setPrinters] = useState<{ printers: string[] }>({
    printers: [],
  });
  const [selectedPrinter, setSelectedPrinter] = useState<{
    printer: string | null | undefined;
  }>({ printer: null });

  useEffect(() => {
    async function loadPrinterData() {
      try {
        // Obtiene la lista de impresoras y la impresora seleccionada
        const printersResult = await QikPOS.getPrinters();
        const selectedPrinterResult = await QikPOS.getSelectedPrinter();

        setPrinters(printersResult);

        setSelectedPrinter({ printer: selectedPrinterResult.printer });

        console.log(printersResult); // Log para depuración
      } catch (error) {
        console.error("Error al cargar los datos de impresoras:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPrinterData();
  }, []);

  const handlePrinterChange = async (printer: string) => {
    try {
      const qikpos = await import("qikpos");
      await qikpos.selectPrinter(printer);

      // Actualizar el estado local para reflejar el cambio
      setSelectedPrinter({ printer });

      console.log("Impresora cambiada a:", printer);
    } catch (error) {
      console.error("Error al cambiar la impresora:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 p-10">
        <p>Cargando configuración de impresoras...</p>
      </div>
    );
  }

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
        onPrinterChange={handlePrinterChange}
      />
    </div>
  );
}
