import { useState, useEffect } from "react";
import QikPOS, { selectLabelPrinter, getSelectedLabelPrinter } from "qikpos";

interface PrinterState {
  printers: string[];
  selectedThermalPrinter: string | null;
  selectedLabelPrinter: string | null;
  loading: boolean;
  error: string | null;
}

interface PrinterActions {
  changeThermalPrinter: (printer: string) => Promise<boolean>;
  changeLabelPrinter: (printer: string) => Promise<boolean>;
  refreshPrinters: () => Promise<void>;
}

export function usePrinters(): PrinterState & PrinterActions {
  const [state, setState] = useState<PrinterState>({
    printers: [],
    selectedThermalPrinter: null,
    selectedLabelPrinter: null,
    loading: true,
    error: null,
  });

  const PRINTER_SERVER_URL = "http://localhost:30080";

  const loadPrinterData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [printersResult, selectedThermalResult, selectedLabelResult] =
        await Promise.all([
          QikPOS.getPrinters(),
          QikPOS.getSelectedPrinter(PRINTER_SERVER_URL),
          getSelectedLabelPrinter(PRINTER_SERVER_URL),
        ]);

      setState((prev) => ({
        ...prev,
        printers: printersResult.printers || [],
        selectedThermalPrinter: selectedThermalResult.printer || null,
        selectedLabelPrinter: selectedLabelResult.printer || null,
        loading: false,
      }));
    } catch (error) {
      console.error("Error loading printer data:", error);
      setState((prev) => ({
        ...prev,
        error: "Error al cargar los datos de impresoras",
        loading: false,
      }));
    }
  };

  const changeThermalPrinter = async (printer: string): Promise<boolean> => {
    try {
      await QikPOS.selectPrinter(printer, PRINTER_SERVER_URL);
      setState((prev) => ({ ...prev, selectedThermalPrinter: printer }));
      return true;
    } catch (error) {
      console.error("Error changing thermal printer:", error);
      setState((prev) => ({
        ...prev,
        error: "Error al cambiar la impresora térmica",
      }));
      return false;
    }
  };

  const changeLabelPrinter = async (printer: string): Promise<boolean> => {
    try {
      const response = await selectLabelPrinter(printer, PRINTER_SERVER_URL);
      if (response.success) {
        setState((prev) => ({ ...prev, selectedLabelPrinter: printer }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error changing label printer:", error);
      setState((prev) => ({
        ...prev,
        error: "Error al cambiar la impresora de etiquetas",
      }));
      return false;
    }
  };

  useEffect(() => {
    loadPrinterData();
  }, []);

  return {
    ...state,
    changeThermalPrinter,
    changeLabelPrinter,
    refreshPrinters: loadPrinterData,
  };
}
