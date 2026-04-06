import {
  getEquipments,
  getEquipmentModels,
  createEquipment,
  deleteEquipment,
  createEquipmentModel,
  updateEquipment,
  assignEquipmentToCustomer,
  removeEquipmentFromCustomer,
  EquipmentAssignment,
  EquipmentRemoval,
  getEquipmentByID,
  setShowOnMobile,
  setGPSUpdate,
  getAssigmentDocument,
  getEquipmentsLocations,
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

export function useEquipment(equipment_id: number | null) {
  return useQuery({
    queryKey: ["equipment", equipment_id],
    queryFn: () => getEquipmentByID(equipment_id),
    enabled: !!equipment_id,
  });
}

export function useShowInMobileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: number; show: boolean }) =>
      setShowOnMobile(variables.id, variables.show),
    onSuccess: async (response, variables) => {
      toast.success(response.message || "Visibilidad actualizada");
      await queryClient.invalidateQueries({
        queryKey: ["equipment", variables.id],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || "Error al actualizar la visibilidad";
      toast.error(errorMessage);
    },
  });
}

export function useGPSUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: number; need_update: boolean }) =>
      setGPSUpdate(variables.id, variables.need_update),
    onSuccess: async (response, variables) => {
      toast.success(
        response.message || "Solicitud de actualización de GPS exitosa",
      );
      await queryClient.invalidateQueries({
        queryKey: ["equipment", variables.id],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || "Error al actualizar el GPS";
      toast.error(errorMessage);
    },
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
    onSuccess: (variable) => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({
        queryKey: ["equipment", variable.data.id],
      });
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
      // toast.error("Ocurrió un problema al eliminar el equipo.");
      console.log("Error deleting equipment");
    },
  });
};

export const useAssignEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EquipmentAssignment) => assignEquipmentToCustomer(data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Equipo asignado exitosamente");
      // Invalidar queries relacionadas para actualizar la UI
      queryClient.invalidateQueries({
        queryKey: ["equipment", variables.equipment_id],
      });
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || "Error al asignar el equipo";
      toast.error(errorMessage);
    },
  });
};

export const useRemoveEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      equipmentId,
      data,
    }: {
      equipmentId: number;
      data: EquipmentRemoval;
    }) => removeEquipmentFromCustomer(equipmentId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "Equipo removido exitosamente");
      // Invalidar queries relacionadas para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["equipment", variables.equipmentId],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error || "Error al remover el equipo";
      toast.error(errorMessage);
    },
  });
};

export const useAssignmentDocument = (assignmentId: number | null) => {
  return useQuery({
    queryKey: ["assignmentDocuments", assignmentId],
    queryFn: async () => {
      getAssigmentDocument(assignmentId as number);
    },
    enabled: assignmentId !== null,
  });
};

export const useEquipmentsLocations = () => {
  return useQuery({
    queryKey: ["equipmentsLocations"],
    queryFn: getEquipmentsLocations,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: true, // Always enabled
  });
};
