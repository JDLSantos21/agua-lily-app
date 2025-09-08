"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrinters } from "@/hooks/usePrinters";
import PrinterStatusCard from "@/components/printers/PrinterStatusCard";
import PrinterConfiguration from "@/components/printers/PrinterConfiguration";

export default function PrintersPageContent() {
  const {
    printers,
    selectedThermalPrinter,
    selectedLabelPrinter,
    loading,
    error,
    changeThermalPrinter,
    changeLabelPrinter,
    refreshPrinters,
  } = usePrinters();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <PrinterStatusCard
          title="Impresora Térmica"
          selectedPrinter={selectedThermalPrinter}
          icon="thermal"
          description="Para tickets y recibos"
        />
        <PrinterStatusCard
          title="Impresora de Etiquetas"
          selectedPrinter={selectedLabelPrinter}
          icon="label"
          description="Para etiquetas y códigos"
        />
      </div>

      {/* Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <PrinterConfiguration
          title="Configurar Impresora Térmica"
          printers={printers}
          selectedPrinter={selectedThermalPrinter}
          onPrinterChange={changeThermalPrinter}
          description="Selecciona la impresora para tickets y recibos"
        />
        <PrinterConfiguration
          title="Configurar Impresora de Etiquetas"
          printers={printers}
          selectedPrinter={selectedLabelPrinter}
          onPrinterChange={changeLabelPrinter}
          description="Selecciona la impresora para etiquetas y códigos"
        />
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={refreshPrinters} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar lista de impresoras
        </Button>
      </div>
    </div>
  );
}
