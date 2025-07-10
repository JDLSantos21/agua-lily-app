// src/api/customers.ts - VERSIÓN MEJORADA
import { api } from "@/services/api";
import {
  Customer,
  CustomerFilter,
  CustomersResponse,
  CustomerResponse,
  CustomerWithEquipmentResponse,
  CustomerStatsResponse,
} from "@/types/customers.types";

/**
 * API para gestión de clientes
 */

/**
 * Obtiene todos los clientes con filtros opcionales
 */
export const getCustomers = async (
  filters?: CustomerFilter
): Promise<CustomersResponse> => {
  const res = await api.get(`customers`, {
    params: filters,
  });
  return res.data;
};

/**
 * Obtiene un cliente por su ID
 */
export const getCustomerById = async (
  id: number
): Promise<CustomerResponse> => {
  const res = await api.get(`customers/${id}`);
  return res.data;
};

/**
 * Obtiene un cliente con sus equipos asociados
 */
export const getCustomerWithEquipment = async (
  id: number
): Promise<CustomerWithEquipmentResponse> => {
  const res = await api.get(`customers/${id}/equipment`);
  return res.data;
};
/**
 * Crea un nuevo cliente
 */
export const createCustomer = async (
  customer: Omit<Customer, "id">
): Promise<CustomerResponse> => {
  const res = await api.post(`customers`, customer);
  return res.data;
};

/**
 * Actualiza un cliente existente
 */
export const updateCustomer = async (
  id: number,
  customer: Partial<Customer>
): Promise<CustomerResponse> => {
  const res = await api.put(`customers/${id}`, customer);
  return res.data;
};

/**
 * Actualiza solo el estado de un cliente
 */
export const updateCustomerStatus = async (
  id: number,
  status: "activo" | "inactivo"
): Promise<CustomerResponse> => {
  const res = await api.patch(`customers/${id}/status`, { status });
  return res.data;
};

/**
 * Elimina un cliente
 */
export const deleteCustomer = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`customers/${id}`);
  return res.data;
};

/**
 * Busca clientes por término
 */
export const searchCustomers = async (
  term: string,
  limit: number = 10
): Promise<CustomersResponse> => {
  const res = await api.get(`customers/search`, {
    params: { term, limit },
  });
  return res.data;
};

/**
 * Obtiene estadísticas de clientes
 */
export const getCustomerStats = async (): Promise<CustomerStatsResponse> => {
  const res = await api.get(`customers/stats`);
  return res.data;
};
