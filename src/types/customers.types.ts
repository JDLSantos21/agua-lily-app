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
  id?: number;
  name: string;
  contact_phone: string;
  contact_email?: string | null;
  address: string;
  business_name?: string | null;
  is_business: boolean;
  rnc?: string | null;
  location_reference?: string | null;
  notes?: string | null;
  status: CustomerStatus;
  created_at?: string;
  updated_at?: string;
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
  limit?: number;
  offset?: number;
}

/**
 * Cliente con su información de equipos
 */
export interface Equipment {
  id: number;
  type: string;
  brand: string;
  model: string;
  serial_number: string;
  status: string;
  customer_id?: number;
  assigned_date?: string;
  removed_date?: string | null;
  notes?: string | null;
}

export interface CustomerWithEquipment extends Customer {
  current_equipment: Equipment[];
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
