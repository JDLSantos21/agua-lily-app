import { fetcher } from './fetcher';
import { VehicleChartData } from '@/types/vehicles';

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

export const getVehicles = async (): Promise<Vehicle[]> => {;
  return await fetcher('/vehicles');
};

export const getVehicleConsumption = async (vehicleId: number): Promise<VehicleChartData> => {
  return await fetcher(`/fuel/vehicle/${vehicleId}/consumption`);
};

// export const getVehicleById = async (id: number): Promise<Vehicle> => {
//   return await fetcher<Vehicle>(`/vehicles/${id}`);
// };

// export const createVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> => {
//   return await fetcher<Vehicle>('/vehicles', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(vehicle),
//   });
// };

// export const updateVehicle = async (id: number, vehicle: Partial<Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>>): Promise<Vehicle> => {
//   return await fetcher<Vehicle>(`/vehicles/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(vehicle),
//   });
// };

export const deleteVehicle = async (id: number): Promise<void> => {
  await fetcher(`/vehicles/${id}`, {
    method: 'DELETE',
  });
};