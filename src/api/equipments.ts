import { CreateEquipmentModelFormData } from "@/schemas/equipment";
import { api } from "@/services/api";
import {
  Equipment,
  EquipmentFilter,
  EquipmentModel,
  CreateEquipmentParams,
} from "@/types/equipments.types";

interface EquipmentsResponse {
  success: boolean;
  data: Equipment[];
  total?: number;
  page?: number;
  limit?: number;
}

interface EquipmentsModelsResponse {
  success: boolean;
  data: EquipmentModel[];
}

interface equipmentResponse {
  success: boolean;
  data: Equipment;
}

export const getEquipmentByID = async (
  equipment_id: number | null
): Promise<equipmentResponse> => {
  if (!equipment_id) throw new Error("Equipment ID is required");
  try {
    const res = await api.get(`/equipments/${equipment_id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    throw new Error("Ocurrió un problema al obtener el equipo.");
  }
};

interface ShowInMobileMutationResponse {
  success: boolean;
  message: string;
}

export const setShowOnMobile = async (
  equipment_id: number,
  show: boolean
): Promise<ShowInMobileMutationResponse> => {
  console.log(equipment_id, show);
  try {
    const res = await api.patch(`/equipments/${equipment_id}/show-on-mobile`, {
      show,
    });

    return res.data;
  } catch (error) {
    console.log("Error setting show on mobile:", error);
    throw new Error(
      "Ocurrió un problema al actualizar la visibilidad en móvil."
    );
  }
};

export const setGPSUpdate = async (id: number, need_update: boolean) => {
  try {
    const res = await api.patch(`/equipments/${id}/gps-update`, {
      need_update,
    });
    return res.data;
  } catch (error) {
    console.log("Error setting GPS update:", error);
    throw new Error("Ocurrió un problema al actualizar la ubicación GPS.");
  }
};

export const getEquipments = async (
  filters?: EquipmentFilter
): Promise<EquipmentsResponse> => {
  try {
    // Construir parámetros de consulta
    const params: Record<string, any> = {};

    if (filters) {
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.customer_id) params.customer_id = filters.customer_id;
      if (filters.search) params.search = filters.search;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;
    }

    const res = await api.get("/equipments", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching equipments:", error);
    throw new Error("Ocurrió un problema al obtener los equipos.");
  }
};

export const getEquipmentModels =
  async (): Promise<EquipmentsModelsResponse> => {
    try {
      const res = await api.get("/equipments/models");
      return res.data;
    } catch (error) {
      console.error("Error fetching equipment models:", error);
      throw new Error("Ocurrió un problema al obtener los modelos de equipos.");
    }
  };

interface CreateEquipmentModelResponse {
  success: boolean;
  data: EquipmentModel;
}

export const createEquipmentModel = async (
  data: CreateEquipmentModelFormData
): Promise<CreateEquipmentModelResponse> => {
  try {
    const res = await api.post("/equipments/models", data);
    return res.data;
  } catch (error) {
    console.error("Error creating equipment model:", error);
    throw new Error("Ocurrió un problema al crear el modelo de equipo.");
  }
};

export const updateEquipmentModel = async (
  id: number,
  data: Partial<CreateEquipmentModelFormData>
): Promise<CreateEquipmentModelResponse> => {
  try {
    const res = await api.patch(`/equipments/models/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating equipment model:", error);
    throw new Error("Ocurrió un problema al actualizar el modelo de equipo.");
  }
};

export const createEquipment = async (
  data: CreateEquipmentParams
): Promise<Equipment> => {
  try {
    const res = await api.post("/equipments", data);
    return res.data;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw new Error("Ocurrió un problema al crear el equipo.");
  }
};

export const deleteEquipment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/equipments/${id}`);
  } catch (error) {
    throw error;
    // throw new Error("Ocurrió un problema al keliminar el equipo.");
  }
};

export const updateEquipment = async (
  id: number,
  data: Partial<Equipment>
): Promise<{ success: boolean; data: Equipment }> => {
  try {
    const res = await api.put(`/equipments/${id}`, data);
    return res.data;
  } catch (error) {
    console.log("Error updating equipment:", error);
    throw new Error("Ocurrió un problema al actualizar el equipo.");
  }
};

// Interfaces para asignación de equipos
export interface EquipmentAssignment {
  equipment_id: number;
  customer_id: number;
  notes?: string;
  weekly_commitment?: number;
}

export interface EquipmentRemoval {
  removal_reason: string;
}

export const assignEquipmentToCustomer = async (
  data: EquipmentAssignment
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await api.post("/equipments/assign", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeEquipmentFromCustomer = async (
  equipmentId: number,
  data: EquipmentRemoval
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await api.post(`/equipments/${equipmentId}/remove`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};
