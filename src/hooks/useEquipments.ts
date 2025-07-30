import {
  getEquipments,
  getEquipmentModels,
  createEquipment,
  deleteEquipment,
  createEquipmentModel,
  updateEquipment,
} from "@/api/equipments";
import { CreateEquipmentModelFormData } from "@/schemas/equipment";
import {
  CreateEquipmentParams,
  Equipment,
  EquipmentFilter,
} from "@/types/equipments.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useEquipments(filters?: EquipmentFilter) {
  return useQuery({
    queryKey: ["equipments", filters],
    queryFn: () => getEquipments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: true, // Always enabled, filters are optional
  });
}

export function useEquipmentModels() {
  return useQuery({
    queryKey: ["equipmentModels"],
    queryFn: getEquipmentModels,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: true, // Always enabled
  });
}

export function useEquipmentModelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEquipmentModelFormData) =>
      createEquipmentModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipmentModels"] });
      toast.success("El modelo de equipo ha sido creado correctamente");
    },
    onError: () => {
      toast.error("Ocurrió un problema al crear el modelo de equipo.");
    },
  });
}

export function useEquipmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEquipmentParams) => createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });
}

export const useUpdateEquipmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Equipment> }) =>
      updateEquipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("El equipo ha sido actualizado correctamente");
    },
    onError: () => {
      toast.error("Ocurrió un problema al actualizar el equipo.");
    },
  });
};

export const useDeleteEquipmentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("El equipo ha sido eliminado correctamente");
    },
    onError: () => {
      toast.error("Ocurrió un problema al eliminar el equipo.");
    },
  });
};
