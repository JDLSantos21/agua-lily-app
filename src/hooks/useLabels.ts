// hooks/useLabels.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { labelService } from "@/services/labelService";
import { toast } from "sonner";
import { printerService } from "@/services/printService";

// Hook para obtener la información de la sesión actual
export const useSessionInfo = () => {
  return useQuery({
    queryKey: ["labelSession"],
    queryFn: () => labelService.getSessionInfo(),
  });
};

// Hook para obtener las etiquetas de hoy
export const useTodayLabels = () => {
  return useQuery({
    queryKey: ["labels", "today"],
    queryFn: () => labelService.getTodayLabels(),
  });
};

// Hook para obtener etiquetas por fecha
export const useLabelsByDate = (date: string) => {
  return useQuery({
    queryKey: ["labels", "date", date],
    queryFn: () => labelService.getLabelsByDate(date),
    enabled: !!date, // Solo ejecuta la consulta si hay una fecha
  });
};

// Hook para obtener etiquetas filtradas
export const useFilteredLabels = (filters: {
  date?: string;
  status?: string;
  product_id?: number;
}) => {
  return useQuery({
    queryKey: ["labels", "filtered", filters],
    queryFn: () => labelService.getFilteredLabels(filters),
    enabled: !!Object.values(filters).some(Boolean), // Solo ejecuta si hay al menos un filtro
  });
};

export const useGenerateAndPrintLabels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      quantity: number;
      description?: string;
      product_id?: number;
    }) => {
      // 1. Generar la etiqueta
      const labels = await labelService.generateLabels(
        params.quantity,
        params.description,
        params.product_id
      );

      if (!labels || labels.length === 0) {
        throw new Error("No se generaron etiquetas");
      }

      // 2. Extraer los datos para impresión
      const { sequence_number, date, created_at, quantity } = labels[0];

      const labelData = {
        sequence_number,
        date,
        created_at,
        quantity,
        description: params.description,
      };

      // 3. Imprimir la etiqueta
      const printResult = await printerService.printBottleLabel(labelData);

      // 4. Actualizar el estado de la etiqueta a 'printed'
      await labelService.updateLabelStatus(labels[0].id, "printed");

      // 5. Devolver tanto la etiqueta como el resultado de impresión
      return {
        labels,
        printResult,
      };
    },
    onSuccess: () => {
      // Invalidar consultas para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ["labels", "today"] });
      queryClient.invalidateQueries({ queryKey: ["labelSession"] });
      toast.success("Etiqueta generada e impresa correctamente");
    },
    onError: (error) => {
      console.error("Error al generar e imprimir etiqueta:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Ocurrió un error, contacte al administrador");
      }
    },
  });
};
// Hook para actualizar el estado de una etiqueta
export const useUpdateLabelStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      labelService.updateLabelStatus(id, status),
    onSuccess: () => {
      // Invalidar consultas para forzar la actualización de datos
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      toast.success("Estado de etiqueta actualizado");
    },
    onError: (error) => {
      console.error("Error actualizando estado:", error);
      toast.error("Error al actualizar el estado de la etiqueta");
    },
  });
};

// Hook para imprimir una etiqueta
export const usePrintLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      labelId,
      printerName,
    }: {
      labelId: number;
      printerName?: string;
    }) => labelService.printLabel(labelId, printerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      toast.success("Etiqueta enviada a imprimir");
    },
    onError: (error) => {
      console.error("Error imprimiendo etiqueta:", error);
      toast.error("Error al imprimir la etiqueta");
    },
  });
};

// Hook para finalizar la sesión del día
export const useEndDaySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => labelService.endDaySession(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labelSession"] });
      queryClient.invalidateQueries({ queryKey: ["labels", "today"] });
      toast.success("Sesión del día finalizada correctamente");
    },
    onError: (error) => {
      console.error("Error al finalizar sesión:", error);
      toast.error("Error al finalizar la sesión del día");
    },
  });
};

// Hook para obtener estadísticas de etiquetas
export const useLabelStats = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["labels", "stats", startDate, endDate],
    queryFn: () => labelService.getLabelStats(startDate, endDate),
    enabled: !!startDate && !!endDate, // Solo ejecuta si ambas fechas están presentes
  });
};

// Hook para reabrir una sesión cerrada (solo para administradores)
export const useReopenDaySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => labelService.reopenDaySession(date),
    onSuccess: (data, date) => {
      queryClient.invalidateQueries({ queryKey: ["labelSession"] });
      queryClient.invalidateQueries({ queryKey: ["labels", "date", date] });
      queryClient.invalidateQueries({ queryKey: ["labels", "stats"] });
      toast.success("Sesión reabierta correctamente");
    },
    onError: (error) => {
      console.error("Error reabriendo sesión:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("No se pudo reabrir la sesión. Verifique sus permisos.");
      }
    },
  });
};
