import { api } from "@/services/api";
import { Vehicle, VehicleChartData } from "@/types/vehicles";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const res = await api.get("/vehicles");
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
