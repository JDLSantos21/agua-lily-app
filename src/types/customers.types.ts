// src/types/customers.types.ts - VERSIÓN MEJORADA
/**
 * Tipos para el módulo de clientes
 * ------------------------------
 * Incluye interfaces mejoradas con:
 * - Tipado estricto
 * - Documentación
 * - Enums para valores constantes
 */

/**
 * Estados posibles para un cliente
 */
export enum CustomerStatus {
  ACTIVE = "activo",
  INACTIVE = "inactivo",
}

/**
 * Interfaz principal de Cliente
 */
export interface Customer {
  id: number;
  name: string;
  contact_phone: string;
  has_whatsapp: boolean;
  contact_email: string;
  address: string;
  business_name: string;
  is_business: boolean;
  rnc: string;
  location_reference: string;
  notes: string | null;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
  coordinates_lat: string;
  coordinates_lng: string;
  coordinates_saved_at: string;
  coordinates_save_by: number;
}

/**
 * Tipo para crear un nuevo cliente
 * Omite el ID ya que se generará en el servidor
 */
export type CustomerCreate = Omit<Customer, "id" | "created_at" | "updated_at">;

/**
 * Tipo para actualizar un cliente existente
 * Hace todos los campos opcionales excepto el ID
 */
export type CustomerUpdate = Partial<Omit<Customer, "id">> & { id: number };

/**
 * Filtros disponibles para buscar clientes
 */
export interface CustomerFilter {
  search?: string;
  status?: CustomerStatus;
  is_business?: boolean;
  has_whatsapp?: boolean; // ← NUEVO FILTRO OPCIONAL
  limit?: number;
  offset?: number;
}

/**
 * Cliente con su información de equipos
 */
export interface Equipment {
  id: number;
  serial_number: string;
  type: string;
  description: string;
  brand: string;
  status: string;
  assigned_date: string;
  removed_date: string | null;
  removal_reason: string | null;
  weekly_commitment: string | null;
  notes: string | null;
  assigned_by: string;
}

export interface CustomerWithEquipment extends Customer {
  current_equipments: Equipment[];
  equipment_history: Equipment[];
}

/**
 * Estadísticas de clientes
 */
export interface CustomerStats {
  total_clientes: number;
  clientes_empresa: number;
  clientes_individuales: number;
  clientes_activos: number;
  clientes_inactivos: number;
}

/**
 * Interfaces de respuesta API
 */
export interface ApiResponse {
  success: boolean;
}

export interface PaginationInfo {
  total: number;
  limit: number | null;
  offset: number;
}

export interface CustomersResponse extends ApiResponse {
  data: Customer[];
  pagination: PaginationInfo;
}

export interface CustomerResponse extends ApiResponse {
  data: Customer;
}

export interface CustomerWithEquipmentResponse extends ApiResponse {
  data: CustomerWithEquipment;
}

export interface CustomerStatsResponse extends ApiResponse {
  data: CustomerStats;
}

/**
 * Interfaces para clientes inactivos con equipos
 */
export interface InactiveEquipment {
  equipment_id: number;
  equipment_type: string;
  equipment_model: string;
  equipment_serial: string;
  assigned_date: string;
  weekly_commitment: number | null;
  last_order_date: string | null;
  days_without_order: number;
  expected_product_type: string;
}

export interface InactiveCustomer {
  id: number;
  name: string;
  business_name: string | null;
  contact_phone: string;
  address: string;
  status: CustomerStatus;
  max_days_without_order: number;
  inactive_equipments: InactiveEquipment[];
}

export interface InactiveCustomersResponse extends ApiResponse {
  threshold_days: number;
  count: number;
  data: InactiveCustomer[];
}
