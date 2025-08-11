export interface Equipment {
  id: number;
  serial_number: string;
  type: string;
  model: string;
  brand: string;
  capacity: number;
  capacity_unit: string;
  current_customer_id: any;
  contract_details: any;
  status: string;
  last_maintenance_date: any;
  show_in_mobile: 0 | 1;
  require_gps_update: 0 | 1;
  notes: string;
  created_at: string;
  updated_at: string;
  customer_name: any;
  customer_phone: any;
  customer_address: any;
  latitude: string;
  longitude: string;
  location_created_at: string;
}

export interface EquipmentFilter {
  type?: string;
  status?: string;
  customer_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface EquipmentFilterFormData {
  type: string;
  status: string;
  search: string;
}

export interface EquipmentModel {
  id: number;
  description: string;
  brand: string;
  type: "nevera" | "anaquel" | "otro";
  capacity: number;
  capacity_unit: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEquipmentParams {
  model_id: number;
  current_customer_id?: number | null;
  contract_details?: string;
  status?: "disponible" | "asignado" | "mantenimiento" | "inhabilitado";
  last_maintenance_date?: string | null;
  notes?: string;
}
