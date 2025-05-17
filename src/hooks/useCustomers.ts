// src/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  getCustomerById,
  getCustomerWithEquipment,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  searchCustomers,
  getCustomerStats,
} from "@/api/customers";
import { Customer, CustomerFilter } from "@/types/customers.types";
import { toast } from "sonner";

// Hook para obtener todos los clientes con filtros opcionales
export const useCustomers = (filters?: CustomerFilter) => {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getCustomers(filters),
  });
};

// Hook para obtener un cliente por su ID
export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

// Hook para obtener un cliente con sus equipos
export const useCustomerWithEquipment = (id: number) => {
  return useQuery({
    queryKey: ["customer", id, "equipment"],
    queryFn: () => getCustomerWithEquipment(id),
    enabled: !!id, // Solo ejecutar si hay un ID
  });
};

// Hook para crear un nuevo cliente
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: Customer) => createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el cliente");
    },
  });
};

// Hook para actualizar un cliente existente
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      customer,
    }: {
      id: number;
      customer: Partial<Customer>;
    }) => updateCustomer(id, customer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
      toast.success("Cliente actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el cliente");
    },
  });
};

// Hook para actualizar solo el estado de un cliente
export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "activo" | "inactivo";
    }) => updateCustomerStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
      toast.success(`Estado del cliente actualizado a '${variables.status}'`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el estado del cliente");
    },
  });
};

// Hook para eliminar un cliente
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el cliente");
    },
  });
};

// Hook para buscar clientes por término
export const useSearchCustomers = (term: string, limit?: number) => {
  return useQuery({
    queryKey: ["customers", "search", term, limit],
    queryFn: () => searchCustomers(term, limit),
    enabled: !!term, // Solo ejecutar si hay un término de búsqueda
  });
};

// Hook para obtener estadísticas de clientes
export const useCustomerStats = () => {
  return useQuery({
    queryKey: ["customers", "stats"],
    queryFn: () => getCustomerStats(),
  });
};
