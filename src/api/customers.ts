// src/api/customers.ts
import { fetcher } from "./fetcher";
import {
  Customer,
  CustomerFilter,
  CustomersResponse,
  CustomerResponse,
  CustomerWithEquipmentResponse,
  CustomerStatsResponse,
} from "@/types/customers.types";

// Obtener todos los clientes con filtros opcionales
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

// Obtener un cliente por su ID
export const getCustomerById = async (
  id: number
): Promise<CustomerResponse> => {
  return await fetcher(`/customers/${id}`, {
    method: "GET",
  });
};

// Obtener un cliente con sus equipos
export const getCustomerWithEquipment = async (
  id: number
): Promise<CustomerWithEquipmentResponse> => {
  return await fetcher(`/customers/${id}/equipment`, {
    method: "GET",
  });
};

// Crear un nuevo cliente
export const createCustomer = async (
  customer: Customer
): Promise<CustomerResponse> => {
  return await fetcher(`/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customer),
  });
};

// Actualizar un cliente existente
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

// Actualizar solo el estado de un cliente
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

// Eliminar un cliente
export const deleteCustomer = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  return await fetcher(`/customers/${id}`, {
    method: "DELETE",
  });
};

// Buscar clientes por término
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

// Obtener estadísticas de clientes
export const getCustomerStats = async (): Promise<CustomerStatsResponse> => {
  return await fetcher(`/customers/stats`, {
    method: "GET",
  });
};
