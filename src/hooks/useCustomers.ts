// src/hooks/useCustomers.ts - VERSIÓN MEJORADA
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
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
  getInactiveCustomers,
} from "@/api/customers";
import {
  Customer,
  CustomerFilter,
  CustomersResponse,
  CustomerResponse,
  CustomerWithEquipmentResponse,
  CustomerStatsResponse,
  InactiveCustomersResponse,
} from "@/types/customers.types";
import { toast } from "sonner";
import { CustomerFormValues } from "@/app/(protected)/clientes/components/customer-form-dialog";

// Claves de cache consistentes para evitar duplicaciones
export const CACHE_KEYS = {
  all: ["customers"] as const,
  lists: () => [...CACHE_KEYS.all, "list"] as const,
  list: (filters: CustomerFilter = {}) =>
    [...CACHE_KEYS.lists(), filters] as const,
  details: () => [...CACHE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...CACHE_KEYS.details(), id] as const,
  equipment: (id: number) => [...CACHE_KEYS.detail(id), "equipment"] as const,
  search: (term: string, limit?: number) =>
    [...CACHE_KEYS.lists(), "search", term, limit] as const,
  stats: () => [...CACHE_KEYS.all, "stats"] as const,
  inactive: (daysThreshold: number) =>
    [...CACHE_KEYS.all, "inactive", daysThreshold] as const,
};

/**
 * Hook para obtener todos los clientes con filtros opcionales
 */
export const useCustomers = (
  filters?: CustomerFilter,
  options?: Partial<UseQueryOptions<CustomersResponse>>,
) => {
  // Limpiar filtros vacíos para evitar consultas innecesarias
  const cleanFilters = filters ? { ...filters } : {};

  // Remover campos undefined para normalizar la cache key
  Object.keys(cleanFilters).forEach((key) => {
    if (
      cleanFilters[key as keyof CustomerFilter] === undefined ||
      cleanFilters[key as keyof CustomerFilter] === ""
    ) {
      delete cleanFilters[key as keyof CustomerFilter];
    }
  });

  return useQuery({
    queryKey: CACHE_KEYS.list(cleanFilters),
    queryFn: () => getCustomers(cleanFilters),
    // Mantener data anterior mientras se carga nueva página
    placeholderData: (old) => old,
    // Cache por 30 segundos para evitar refetches frecuentes
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Hook para obtener un cliente por su ID
 */
export const useCustomer = (
  id: number,
  options?: UseQueryOptions<CustomerResponse>,
) => {
  return useQuery({
    queryKey: CACHE_KEYS.detail(id),
    queryFn: () => getCustomerById(id),
    enabled: id > 0, // Solo ejecutar si hay un ID válido
    ...options,
  });
};

/**
 * Hook para obtener un cliente con sus equipos
 */
export const useCustomerWithEquipment = (
  id: number,
  options?: UseQueryOptions<CustomerWithEquipmentResponse>,
) => {
  return useQuery({
    queryKey: CACHE_KEYS.equipment(id),
    queryFn: () => getCustomerWithEquipment(id),
    enabled: id > 0,
    ...options,
  });
};

/**
 * Hook para crear un nuevo cliente
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: CustomerFormValues) => createCustomer(customer),
    onSuccess: () => {
      // Invalidar todas las listas de clientes para refrescarlas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
      toast.success("Cliente creado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el cliente");
    },
  });
};

/**
 * Hook para actualizar un cliente existente
 */
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
    onSuccess: (data, variables) => {
      // Actualizar caché específica y listas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.equipment(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
      toast.success("Cliente actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el cliente");
    },
  });
};

/**
 * Hook para actualizar solo el estado de un cliente
 */
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
    onSuccess: (data, variables) => {
      // Actualizar caché específica y listas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
      toast.success(
        `Cliente ${variables.status === "activo" ? "activado" : "desactivado"} exitosamente`,
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el estado del cliente");
    },
  });
};

/**
 * Hook para eliminar un cliente
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: (_, id) => {
      // Invalidar todas las listas y eliminar detalles específicos
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.removeQueries({ queryKey: CACHE_KEYS.detail(id as number) });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
      toast.success("Cliente eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el cliente");
    },
  });
};

/**
 * Hook para buscar clientes por término
 */
export const useSearchCustomers = (
  term: string,
  limit?: number,
  options?: UseQueryOptions<CustomersResponse>,
) => {
  return useQuery({
    queryKey: CACHE_KEYS.search(term, limit),
    queryFn: () => searchCustomers(term, limit),
    enabled: !!term && term.length > 0, // Solo ejecutar si hay un término válido
    ...options,
  });
};

/**
 * Hook para obtener estadísticas de clientes
 */
export const useCustomerStats = (
  options?: UseQueryOptions<CustomerStatsResponse>,
) => {
  return useQuery({
    queryKey: CACHE_KEYS.stats(),
    queryFn: () => getCustomerStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos - las estadísticas no se actualizan tan frecuentemente
    ...options,
  });
};

/**
 * Hook para obtener clientes inactivos con equipos
 */
export const useInactiveCustomers = (
  daysThreshold: number = 14,
  options?: Partial<UseQueryOptions<InactiveCustomersResponse>>,
) => {
  return useQuery({
    queryKey: CACHE_KEYS.inactive(daysThreshold),
    queryFn: () => getInactiveCustomers(daysThreshold),
    staleTime: 5 * 60 * 1000, // 5 minutos - cache por tiempo razonable
    refetchOnWindowFocus: true, // Refetch al volver a la ventana
    ...options,
  });
};
