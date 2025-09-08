"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Settings, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PrinterConfigurationProps {
  title: string;
  printers: string[];
  selectedPrinter: string | null;
  onPrinterChange: (printer: string) => Promise<boolean>;
  description?: string;
}

export default function PrinterConfiguration({
  title,
  printers,
  selectedPrinter,
  onPrinterChange,
  description,
}: PrinterConfigurationProps) {
  const [currentSelection, setCurrentSelection] = useState(
    selectedPrinter || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectChange = (value: string) => {
    setCurrentSelection(value);
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    if (currentSelection === selectedPrinter || !currentSelection) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onPrinterChange(currentSelection);
      if (result) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("No se pudo actualizar la impresora. Intenta nuevamente.");
      }
    } catch (error) {
      setError("Error inesperado al actualizar la impresora.");
      console.error("Failed to update printer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPrinterChanged =
    currentSelection !== selectedPrinter && currentSelection !== "";
  const hasAvailablePrinters = printers && printers.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAvailablePrinters ? (
          <Alert>
            <AlertDescription>
              No se encontraron impresoras disponibles. Asegúrate de que las
              impresoras estén conectadas y configuradas correctamente.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Seleccionar impresora
              </label>
              <Select
                value={currentSelection}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una impresora" />
                </SelectTrigger>
                <SelectContent>
                  {printers.map((printer) => (
                    <SelectItem key={printer} value={printer}>
                      {printer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between pt-2">
              {success && (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="h-4 w-4 mr-2" />
                  Configuración actualizada correctamente
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={!isPrinterChanged || isSubmitting}
                className="ml-auto"
                size="sm"
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
