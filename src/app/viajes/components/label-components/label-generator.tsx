"use client";

import { useEffect, useRef, useState } from "react";
import {
  useGenerateAndPrintLabels,
  useSessionInfo,
  useTodayLabels,
} from "@/hooks/useLabels";
import TodayLabelsModal from "./today-labels-modal";
import SessionStatusIndicator from "./session-status-indicator";
import PrintMultipleModal from "./print-multiple-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, Printer, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { printerService } from "@/services/printService";
import { Label } from "@/types/label.types";

export default function LabelsGenerateSection() {
  const [inputQty, setInputQty] = useState<number | null>(null);
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const [printMultipleModalOpen, setPrintMultipleModalOpen] = useState(false);

  const labelInput = useRef<HTMLInputElement>(null);

  // Hooks para manejar las etiquetas
  const { data: sessionInfo } = useSessionInfo();
  const {
    data: todayLabels,
    isLoading: labelsLoading,
    refetch: refetchLabels,
  } = useTodayLabels();
  const generateLabelMutation = useGenerateAndPrintLabels();

  // Focus al input con las teclas control + l
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        labelInput.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Generar e imprimir etiquetas nuevas
  const handleLabelsGeneration = () => {
    if (inputQty === null || inputQty <= 0) {
      toast.warning("Por favor ingrese una cantidad válida.");
      return;
    } else if (inputQty > 50) {
      toast.info("La cantidad máxima de etiquetas a generar es 50.");
      return;
    }

    // Verificar si la sesión está cerrada
    if (sessionInfo?.is_closed) {
      toast.error(
        "La sesión del día está cerrada. No se pueden generar más etiquetas."
      );
      return;
    }

    generateLabelMutation.mutate({
      quantity: inputQty,
    });

    setInputQty(null);
  };

  // Reimprimir etiqueta existente
  const handleReprintLabel = async (label: Label, quantity = 1) => {
    try {
      setIsPrinting(true);
      const { sequence_number, created_at } = label;

      const labelData = {
        sequence_number,
        created_at,
        quantity,
      };

      await printerService.printBottleLabel(labelData);
      toast.success(`${quantity} etiqueta(s) reimpresa(s) correctamente`);

      // Cerrar modal si está imprimiendo múltiples
      if (quantity > 1) {
        setPrintMultipleModalOpen(false);
      }
    } catch (error) {
      console.error("Error al reimprimir etiqueta:", error);
      toast.error("Error al reimprimir la etiqueta");
    } finally {
      setIsPrinting(false);
    }
  };

  // Abrir modal para imprimir múltiples etiquetas
  const openPrintMultipleModal = (label: Label) => {
    setSelectedLabel(label);
    setPrintMultipleModalOpen(true);
  };

  // Handler para la tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLabelsGeneration();
    }
  };

  // Manejador para abrir el modal de etiquetas
  const handleOpenLabelsModal = () => {
    refetchLabels();
    setLabelsModalOpen(true);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-100 p-5">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Panel izquierdo: información y entrada */}
        <div className="flex-grow w-full sm:w-auto">
          <div className="flex items-center mb-2 gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Generador Etiquetas de Botellones
            </h2>
          </div>

          <div className="flex items-end gap-3 w-full">
            <div className="flex-grow">
              <label
                htmlFor="quantity"
                className="block text-sm text-muted-foreground mb-1"
              >
                Cantidad de etiquetas a generar
              </label>
              <Input
                id="quantity"
                ref={labelInput}
                value={inputQty?.toString() || ""}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? null : parseInt(e.target.value);
                  setInputQty(value);
                }}
                onKeyDown={handleKeyPress}
                type="number"
                min={1}
                placeholder="Ingrese cantidad"
                className="border h-12 noControls"
                disabled={
                  generateLabelMutation.isPending || sessionInfo?.is_closed
                }
              />
            </div>

            <Button
              variant="primary"
              onClick={handleLabelsGeneration}
              disabled={
                generateLabelMutation.isPending || sessionInfo?.is_closed
              }
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generateLabelMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  <span>Generar e Imprimir</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Panel derecho: información de contador */}
        <div className="flex flex-col gap-2">
          {/* Componente de estado de sesión */}
          <SessionStatusIndicator sessionInfo={sessionInfo} />

          {/* Botón para ver etiquetas del día */}
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center border-blue-200 text-blue-600"
            onClick={handleOpenLabelsModal}
          >
            <List size={18} />
            <span>Ver etiquetas del día</span>
          </Button>
        </div>
      </div>

      {/* Mensaje de alerta cuando la sesión está cerrada */}
      {sessionInfo?.is_closed && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle
            className="text-red-500 mt-0.5 flex-shrink-0"
            size={18}
          />
          <div>
            <p className="text-red-700 text-sm font-medium">
              La sesión del día está cerrada. No se pueden generar más
              etiquetas.
            </p>
            <p className="text-red-600 text-xs mt-1">
              Para reabrir la sesión, por favor contacta al administrador.
            </p>
          </div>
        </div>
      )}

      {/* Modal para ver etiquetas del día */}
      <TodayLabelsModal
        isOpen={labelsModalOpen}
        onOpenChange={setLabelsModalOpen}
        labels={todayLabels}
        isLoading={labelsLoading}
        onRefresh={refetchLabels}
        onPrintOne={handleReprintLabel}
        onPrintMultiple={openPrintMultipleModal}
        isPrinting={isPrinting}
      />

      {/* Modal para imprimir múltiples etiquetas */}
      <PrintMultipleModal
        isOpen={printMultipleModalOpen}
        onOpenChange={setPrintMultipleModalOpen}
        onPrint={(quantity) =>
          selectedLabel && handleReprintLabel(selectedLabel, quantity)
        }
        isPrinting={isPrinting}
      />
    </div>
  );
}
