// src/api/customers.ts - VERSIÓN MEJORADA
import { fetcher } from "./fetcher";
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
 * --------------------------
 * Esta API ha sido optimizada para:
 * 1. Consistencia en parámetros y respuestas
 * 2. Tipado estricto
 * 3. Documentación clara
 */

/**
 * Obtiene todos los clientes con filtros opcionales
 */
export const getCustomers = async (
  filters?: CustomerFilter
): Promise<CustomersResponse> => {
  return await fetcher(
    "/customers",
    {
      method: "GET",
    },
    (filters as Record<string, string | number | Date>) || {}
  );
};

/**
 * Obtiene un cliente por su ID
 */
export const getCustomerById = async (
  id: number
): Promise<CustomerResponse> => {
  return await fetcher(`/customers/${id}`, {
    method: "GET",
  });
};

/**
 * Obtiene un cliente con sus equipos asociados
 */
export const getCustomerWithEquipment = async (
  id: number
): Promise<CustomerWithEquipmentResponse> => {
  return await fetcher(`/customers/${id}/equipment`, {
    method: "GET",
  });
};

/**
 * Crea un nuevo cliente
 */
export const createCustomer = async (
  customer: Omit<Customer, "id">
): Promise<CustomerResponse> => {
  return await fetcher(`/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
};

/**
 * Actualiza un cliente existente
 */
export const updateCustomer = async (
  id: number,
  customer: Partial<Customer>
): Promise<CustomerResponse> => {
  return await fetcher(`/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
};

/**
 * Actualiza solo el estado de un cliente
 */
export const updateCustomerStatus = async (
  id: number,
  status: "activo" | "inactivo"
): Promise<CustomerResponse> => {
  return await fetcher(`/customers/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

/**
 * Elimina un cliente
 */
export const deleteCustomer = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  return await fetcher(`/customers/${id}`, {
    method: "DELETE",
  });
};

/**
 * Busca clientes por término
 */
export const searchCustomers = async (
  term: string,
  limit: number = 10
): Promise<CustomersResponse> => {
  return await fetcher(
    `/customers/search`,
    {
      method: "GET",
    },
    { term, limit }
  );
};

/**
 * Obtiene estadísticas de clientes
 */
export const getCustomerStats = async (): Promise<CustomerStatsResponse> => {
  return await fetcher(`/customers/stats`, {
    method: "GET",
  });
};
