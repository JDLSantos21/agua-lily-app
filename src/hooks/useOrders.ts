// src/hooks/useOrders.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  getOrders,
  getOrderById,
  getOrderByTrackingCode,
  createOrder,
  updateOrder,
  updateOrderStatus,
  assignDelivery,
  deleteOrder,
  searchOrders,
  getProducts,
  getOrderStats,
  getDashboardData,
  getOrdersForReceiver,
} from "@/api/orders";
import {
  Order,
  OrderFilter,
  OrdersResponse,
  OrderResponse,
  ProductsResponse,
  StatsResponse,
  DashboardResponse,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  AssignDeliveryRequest,
} from "@/types/orders.types";
import { toast } from "sonner";

// Claves de cache consistentes para evitar duplicaciones
const CACHE_KEYS = {
  all: ["orders"] as const,
  lists: () => [...CACHE_KEYS.all, "list"] as const,
  list: (filters: OrderFilter = {}) =>
    [...CACHE_KEYS.lists(), filters] as const,
  details: () => [...CACHE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...CACHE_KEYS.details(), id] as const,
  tracking: (code: string) =>
    [...CACHE_KEYS.details(), "tracking", code] as const,
  search: (term: string, limit?: number) =>
    [...CACHE_KEYS.lists(), "search", term, limit] as const,
  stats: () => [...CACHE_KEYS.all, "stats"] as const,
  products: () => [...CACHE_KEYS.all, "products"] as const,
  dashboard: () => [...CACHE_KEYS.all, "dashboard"] as const,
};

/**
 * Hook para obtener todos los pedidos con filtros opcionales
 */
export const useOrders = (
  filters?: OrderFilter,
  options?: Partial<UseQueryOptions<OrdersResponse>>
) => {
  // Limpiar filtros vacíos para evitar consultas innecesarias
  const cleanFilters = filters ? { ...filters } : {};

  // Remover campos undefined para normalizar la cache key
  Object.keys(cleanFilters).forEach((key) => {
    if (
      cleanFilters[key as keyof OrderFilter] === undefined ||
      cleanFilters[key as keyof OrderFilter] === ""
    ) {
      delete cleanFilters[key as keyof OrderFilter];
    }
  });

  return useQuery({
    queryKey: CACHE_KEYS.list(cleanFilters),
    queryFn: () => getOrders(cleanFilters),
    // Mantener data anterior mientras se carga nueva página
    placeholderData: (old) => old,
    // Cache por 30 segundos para evitar refetches frecuentes
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Hook para obtener pedidos del recibidor de pedidos en tiempo real.
 */

export const useOrdersForReceiver = (
  filters?: OrderFilter,
  options?: Partial<UseQueryOptions<OrdersResponse>>
) => {
  // Limpiar filtros vacíos para evitar consultas innecesarias
  const cleanFilters = filters ? { ...filters } : {};

  // Remover campos undefined para normalizar la cache key
  Object.keys(cleanFilters).forEach((key) => {
    if (
      cleanFilters[key as keyof OrderFilter] === undefined ||
      cleanFilters[key as keyof OrderFilter] === ""
    ) {
      delete cleanFilters[key as keyof OrderFilter];
    }
  });

  return useQuery({
    queryKey: CACHE_KEYS.list(cleanFilters),
    queryFn: () => getOrdersForReceiver(cleanFilters),
    // Mantener data anterior mientras se carga nueva página
    placeholderData: (old) => old,
    // Cache por 30 segundos para evitar refetches frecuentes
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Hook para obtener un pedido por su ID
 */
export const useOrder = (
  id: number,
  options?: UseQueryOptions<OrderResponse>
) => {
  return useQuery({
    queryKey: CACHE_KEYS.detail(id),
    queryFn: () => getOrderById(id),
    enabled: typeof id === "number" && id > 0, // Solo ejecutar si hay un ID válido
    ...options,
  });
};

/**
 * Hook para obtener un pedido por su código de seguimiento
 */
export const useOrderByTracking = (
  trackingCode: string,
  options?: Partial<UseQueryOptions<OrderResponse>>
) => {
  return useQuery({
    queryKey: CACHE_KEYS.tracking(trackingCode),
    queryFn: () => getOrderByTrackingCode(trackingCode),
    enabled: !!trackingCode && trackingCode.length > 0, // Solo ejecutar si hay un código
    ...options,
  });
};

/**
 * Hook para obtener estadísticas de pedidos
 */
export const useOrderStats = (
  options?: Partial<UseQueryOptions<StatsResponse>>
) => {
  return useQuery({
    queryKey: CACHE_KEYS.stats(),
    queryFn: () => getOrderStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos - evita refetches frecuentes
    ...options,
  });
};

/**
 * Hook para obtener datos del dashboard
 */
export const useOrderDashboard = (
  options?: UseQueryOptions<DashboardResponse>
) => {
  return useQuery({
    queryKey: CACHE_KEYS.dashboard(),
    queryFn: () => getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
};

/**
 * Hook para obtener la lista de productos
 */
export const useProducts = (options?: UseQueryOptions<ProductsResponse>) => {
  return useQuery({
    queryKey: CACHE_KEYS.products(),
    queryFn: () => getProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutos - los productos cambian poco
    ...options,
  });
};

/**
 * Hook para buscar pedidos por término
 */
export const useSearchOrders = (
  term: string,
  limit: number = 10,
  options?: Partial<UseQueryOptions<OrdersResponse>>
) => {
  return useQuery({
    queryKey: CACHE_KEYS.search(term, limit),
    queryFn: () => searchOrders(term, limit),
    enabled: term.length >= 2, // Solo buscar con al menos 2 caracteres
    ...options,
  });
};

/**
 * Hook para crear un nuevo pedido
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
    onSuccess: () => {
      toast.success("Pedido creado exitosamente");
      // Invalidar consultas relacionadas
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear el pedido");
    },
  });
};

/**
 * Hook para actualizar un pedido existente
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Order> }) => {
      console.log("Updating order with ID:", id, "and data:", data);
      return updateOrder(id, data);
    },
    onSuccess: (_, variables) => {
      toast.success("Pedido actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el pedido");
    },
  });
};

/**
 * Hook para eliminar un pedido
 */
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: (_, id) => {
      toast.success("Pedido eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.removeQueries({ queryKey: CACHE_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el pedido");
    },
  });
};

/**
 * Hook para actualizar el estado de un pedido
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusRequest;
    }) => updateOrderStatus(id, data),
    onSuccess: (_, variables) => {
      toast.success(`Pedido actualizado a estado "${variables.data.status}"`);
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar el estado del pedido");
    },
  });
};

/**
 * Hook para asignar conductor y vehículo a un pedido
 */
export const useAssignDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssignDeliveryRequest }) =>
      assignDelivery(id, data),
    onSuccess: (_, variables) => {
      toast.success("Entrega asignada exitosamente");
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CACHE_KEYS.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al asignar la entrega");
    },
  });
};
