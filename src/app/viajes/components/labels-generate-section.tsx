import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { labelService } from "@/services/labelService";
import { printerService } from "@/services/printService";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LabelsGenerateSection() {
  const [inputQty, setInputQty] = useState<number | null>(null);
  const user_id = useAuthStore((state) => state.user_id);
  const queryClient = useQueryClient();

  const generateLabelMutation = useMutation({
    mutationFn: async (quantity: number) => {
      if (!user_id) {
        throw new Error("Usuario no encontrado");
      }

      // Generate label
      const labels = await labelService.generateLabels(quantity);

      // Extract data for printing
      const { sequence_number, date, created_at, quantity: qty } = labels[0];
      const labelData = { sequence_number, date, created_at, quantity: qty };

      // Print label
      return await printerService.printBottleLabel(labelData);
    },
    onSuccess: () => {
      toast.success("Etiqueta impresa correctamente.");
      setInputQty(null); // Reset input quantity after printing

      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["labels", "today"] });
      queryClient.invalidateQueries({ queryKey: ["labelSession"] });
    },
    onError: (error) => {
      console.error("Error generating label:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Ocurrió un error, contacte al administrador.");
      }
    },
  });

  const handleLabelsGeneration = () => {
    if (inputQty === null || inputQty <= 0) {
      toast.info("Por favor ingrese una cantidad válida.");
      return;
    }

    generateLabelMutation.mutate(inputQty);
  };

  // Handler for the Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      handleLabelsGeneration();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-4">
          <Input
            value={inputQty?.toString() || ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? null : parseInt(e.target.value);
              setInputQty(value);
            }}
            onKeyDown={handleKeyPress} // Add key press handler here
            type="number"
            min={1}
            placeholder="CANTIDAD DE ETIQUETAS"
            className="border !text-xl w-full h-20 noControls"
            disabled={generateLabelMutation.isPending}
          />
        </div>
        <Button
          variant="primary"
          onClick={handleLabelsGeneration}
          disabled={generateLabelMutation.isPending}
        >
          {generateLabelMutation.isPending
            ? "Generando..."
            : "Generar Etiquetas"}
        </Button>
      </div>
    </div>
  );
}
