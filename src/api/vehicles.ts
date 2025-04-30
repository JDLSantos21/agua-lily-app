import { fetcher } from "./fetcher";
import { VehicleChartData } from "@/types/vehicles";

export interface Vehicle {
  id: number;
  license_plate: string;
  chasis: string;
  current_tag: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  return await fetcher("/vehicles");
};

export const getVehicleConsumption = async (
  vehicleId: number
): Promise<VehicleChartData> => {
  return await fetcher(`/fuel/vehicle/${vehicleId}/consumption`);
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await fetcher(`/vehicles/${id}`, {
    method: "DELETE",
  });
};
