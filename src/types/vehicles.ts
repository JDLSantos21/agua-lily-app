import { Vehicle } from "@/api/vehicles";

export interface VehicleChartData {
  monthlyData: MonthData[];
  recentRecords: RecentRecord[];
}

export interface MonthData {
  month: string;
  total_gallons: number;
  total_kilometers: number;
}

export interface RecentRecord {
  id: number;
  vehicle_id: number;
  driver: string;
  mileage: number;
  gallons: number;
  record_date: string;
  comment: string | null | undefined;
}

export interface VehicleFormData {
  license_plate: string;
  chasis: string;
  current_tag: string;
  brand: string;
  model: string;
  year: number;
  description: string;
}

export const defaultFormData: VehicleFormData = {
  license_plate: "",
  chasis: "",
  current_tag: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  description: "",
};

export interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSuccess: () => Promise<void>;
}
