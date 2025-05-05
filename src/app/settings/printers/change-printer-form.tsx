"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  SelectItem,
  SelectLabel,
  SelectContent,
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChangePrinterFormProps {
  printers: string[];
  selectedPrinter: string;
  onPrinterChange: (printer: string) => Promise<void>;
}

export default function ChangePrinterForm({
  printers,
  selectedPrinter,
  onPrinterChange,
}: ChangePrinterFormProps) {
  const [currentSelection, setCurrentSelection] = useState(selectedPrinter);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSelectChange = (value: string) => {
    setCurrentSelection(value);
    setSuccess(false);
  };

  const handleSave = async () => {
    if (currentSelection === selectedPrinter) return;

    setIsSubmitting(true);
    try {
      await onPrinterChange(currentSelection);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Failed to update printer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!printers || printers.length === 0) {
    return <p className="text-gray-700">No hay impresoras disponibles</p>;
  }

  const isPrinterChanged = currentSelection !== selectedPrinter;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Impresora</label>
        <Select value={currentSelection} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Seleccione una Impresora" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Impresoras disponibles</SelectLabel>
              {printers.map((printer) => (
                <SelectItem key={printer} value={printer}>
                  {printer}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-center">
        {success && (
          <div className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" /> Impresora actualizada
            correctamente
          </div>
        )}
        <div className="ml-auto">
          <Button
            className="h-10 px-5 border-none"
            onClick={handleSave}
            disabled={!isPrinterChanged || isSubmitting}
            variant={isPrinterChanged ? "primary" : "outline"}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}
