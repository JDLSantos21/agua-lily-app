import { api } from "@/services/api";
import { Vehicle, VehicleChartData, VehicleFilters } from "@/types/vehicles";

export const getVehicles = async (
  filters?: VehicleFilters
): Promise<Vehicle[]> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.append(key, value);
      }
    });
  }

  const res = await api.get(
    `/vehicles${params.toString() ? `?${params.toString()}` : ""}`
  );
  return res.data;
};

export const getVehicleConsumption = async (
  vehicleId: number
): Promise<VehicleChartData> => {
  const res = await api.get(`/fuel/vehicle/${vehicleId}/consumption`);
  return res.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  const res = await api.delete(`/vehicles/${id}`);
  return res.data;
};
