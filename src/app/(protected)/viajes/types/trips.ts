// Types for API data
export interface TripData {
  concept: string;
  driver: string;
  driver_id: number;
  trip_count: number;
  total_amount: number;
  trip_ids: number[];
}

export interface DayTrips {
  [key: string]: TripData;
}

export interface VehicleTrips {
  vehicle_id: number;
  vehicle_tag: string;
  trips_by_day: {
    [date: string]: DayTrips;
  };
}

export interface ApiResponse {
  [vehicleId: string]: VehicleTrips;
}

// Types for processed data
export interface DailyTripSummary {
  day: Date;
  dayStr: string;
  conduces: number[];
  concept: string;
  driver: string;
  tripCount: number;
  totalAmount: number;
}

export interface VehicleSummary {
  vehicleId: number;
  vehicleTag: string;
  totalTrips: number;
  totalAmount: number;
  standardTrips: number;
  quickTrips: number;
  commissionTrips: number;
  dailyTrips: DailyTripSummary[];
}

export interface TripReportTableProps {
  data: ApiResponse;
  singleVehicleMode: boolean;
  onExport?: () => void;
}

export interface TripTotals {
  totalTrips: number;
  totalAmount: number;
}

export interface ExcelRow {
  Fecha: string;
  Conduces: string;
  Concepto: string;
  Conductor: string;
  Cantidad: number;
  Total: number;
}

export interface SummaryExcelRow {
  Vehículo: string;
  "Viajes Estándar": number;
  "Viajes Rápidos": number;
  "Comisión por ventas": number;
  "Total Viajes": number;
  "Total a Pagar": number;
}

export interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

export interface CompletedTrip {
  id: number;
  date: string;
  payment_date: string;
  amount: number;
  driver: string;
  user: string;
  payment_user: string;
  vehicle_tag: string;
  concept: string;
  status: string;
}
