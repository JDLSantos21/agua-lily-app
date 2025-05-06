import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGenerateAndPrintLabels, useSessionInfo } from "@/hooks/useLabels";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Printer, AlertCircle, Info, Loader2 } from "lucide-react";

export default function LabelsGenerateSection() {
  const [inputQty, setInputQty] = useState<number | null>(null);

  const labelInput = useRef<HTMLInputElement>(null); // Placeholder for any future ref usage

  // Obtener información de la sesión para verificar si está cerrada
  const { data: sessionInfo } = useSessionInfo();

  console.log("sessionInfo", sessionInfo);

  // Usar nuestro hook personalizado que maneja la generación e impresión
  const generateLabelMutation = useGenerateAndPrintLabels();

  //focus al input con las teclas control + l
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

  const handleLabelsGeneration = () => {
    if (inputQty === null || inputQty <= 0) {
      toast.info("Por favor ingrese una cantidad válida.");
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

  // Handler para la tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLabelsGeneration();
    }
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
          {/* Indicador de estado de sesión */}
          <div
            className={`flex items-center justify-center w-36 gap-2 px-3 py-1 rounded-full text-sm ${
              sessionInfo?.is_closed
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                sessionInfo?.is_closed ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            <span>
              {sessionInfo?.is_closed ? "Sesión cerrada" : "Sesión activa"}
            </span>
          </div>
          {sessionInfo && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3 min-w-56">
              <div className="bg-blue-500 text-white p-2 rounded-full">
                <Info size={20} />
              </div>
              <div>
                {sessionInfo?.is_active ? (
                  <>
                    <p className="text-blue-700 text-sm font-medium">
                      Última Etiqueta
                    </p>
                    <p className="text-blue-900 text-2xl font-bold">
                      {sessionInfo.current_counter.toString().padStart(3, "0")}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-blue-700">
                      Sesión aun no iniciada
                    </p>
                    <p className="text-sm text-blue-700">
                      Genera etiqueta para iniciar
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
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
    </div>
  );
}
