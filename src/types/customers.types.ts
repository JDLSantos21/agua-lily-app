// src/types/customers.types.ts
export interface Customer {
  id?: number;
  name: string;
  contact_phone: string;
  contact_email?: string;
  address: string;
  business_name?: string;
  is_business?: boolean;
  rnc?: string;
  location_reference?: string;
  notes?: string;
  status?: "activo" | "inactivo";
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFilter {
  search?: string;
  status?: "activo" | "inactivo";
  is_business?: boolean;
  limit?: number;
  offset?: number;
}

export interface CustomerWithEquipment extends Customer {
  current_equipment: any[];
  equipment_history: any[];
}

export interface CustomerStats {
  total_clientes: number;
  clientes_empresa: number;
  clientes_individuales: number;
  clientes_activos: number;
  clientes_inactivos: number;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  pagination: {
    total: number;
    limit: number | null;
    offset: number;
  };
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
}

export interface CustomerWithEquipmentResponse {
  success: boolean;
  data: CustomerWithEquipment;
}

export interface CustomerStatsResponse {
  success: boolean;
  data: CustomerStats;
}
