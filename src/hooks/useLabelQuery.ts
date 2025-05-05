import { useMutation } from "@tanstack/react-query";

import { labelService } from "@/services/labelService";
import { printerService } from "@/services/printService";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const user_id = useAuthStore((state) => state.user_id);

const handleLabelsGeneration = async (inputQty: number | null) => {
  if (!user_id || inputQty === null) {
    toast.info("Cantidad no válida o usuario no encontrado.");
    return;
  }

  const labels = await labelService.generateLabels(inputQty, user_id);

  const { sequence_number, date, created_at, quantity } = labels[0];
  const labelData = { sequence_number, date, created_at, quantity };

  return await printerService.printBottleLabel(labelData);
};
