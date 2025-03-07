export interface FuelRecord {
  id: number;
  vehicle_id: string;
  driver: string;
  mileage: number;
  gallons: number;
  record_date: string;
  user_id: number;
  current_tag: string;
  comment?: string;
}

export type FuelRecords = FuelRecord[];

export interface fuelAvailability {
  id: number;
  available: string;
  used: string;
  updated_at: string;
}

export interface FuelRecordResponse {
  fuel_records: FuelRecord[];
  availability: fuelAvailability;
}

export interface Vehicle {
  id: number;
  current_tag?: string;
  license_plate?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Driver {
  id: number;
  name: string;
  last_name: string;
}

export interface InitialData {
  vehicles: Vehicle[];
  drivers: Driver[];
  lastRecords: LastRecord[];
}

export interface LastRecord {
  id: number;
  current_tag: string;
  driver: string;
  gallons: number;
  mileage: number;
  record_date: string;
  vehicle_id: number;
  comment?: string;
}
