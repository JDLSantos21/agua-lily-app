// src/api/orders.ts
import { fetcher } from "./fetcher";
import {
  Order,
  OrderFilter,
  OrdersResponse,
  OrderResponse,
  ProductsResponse,
  StatsResponse,
  DashboardResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderStatusRequest,
  AssignDeliveryRequest,
} from "@/types/orders.types";

/**
 * API para gestión de pedidos
 * --------------------------
 * Esta API proporciona métodos para interactuar con el endpoint de pedidos del servidor
 */

const API_BASE = "/orders";

/**
 * Obtiene todos los pedidos con filtros opcionales
 */
export const getOrders = async (
  filters?: OrderFilter
): Promise<OrdersResponse> => {
  return await fetcher(
    API_BASE,
    {
      method: "GET",
    },
    filters ? { ...filters } : {}
  );
};

/**
 * Obtener pedidos del recibidor de pedidos en tiempo real.
 */

export const getOrdersForReceiver = async (
  filters?: OrderFilter
): Promise<OrdersResponse> => {
  return await fetcher(
    `${API_BASE}/receiver`,
    {
      method: "GET",
    },
    filters ? { ...filters } : {}
  );
};

/**
 * Obtiene un pedido por su ID
 */
export const getOrderById = async (id: number): Promise<OrderResponse> => {
  return await fetcher(`${API_BASE}/${id}`, {
    method: "GET",
  });
};

/**
 * Obtiene un pedido por su código de seguimiento
 */
export const getOrderByTrackingCode = async (
  trackingCode: string
): Promise<OrderResponse> => {
  return await fetcher(`${API_BASE}/track/${trackingCode}`, {
    method: "GET",
  });
};

/**
 * Crea un nuevo pedido
 */
export const createOrder = async (
  order: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  return await fetcher(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
};

/**
 * Actualiza un pedido existente
 */
export const updateOrder = async (
  id: number,
  order: Partial<Order>
): Promise<{ success: boolean; message: string }> => {
  console.log("🌐 updateOrder API - Inicio");
  console.log("🆔 ID:", id);
  console.log("📝 Datos originales:", order);

  // Crear una copia limpia de los datos
  const cleanData = { ...order };

  // Remover propiedades que no deberían enviarse al backend
  delete cleanData.id;
  delete cleanData.tracking_code;
  delete cleanData.order_date;
  delete cleanData.driver_name;
  delete cleanData.vehicle_tag;
  delete cleanData.customer_display_name;
  delete cleanData.status_history;

  console.log("🧹 Datos limpios para enviar:", cleanData);

  try {
    const response = await fetcher(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanData),
    });

    console.log("✅ Respuesta exitosa:", response);
    return response;
  } catch (error) {
    console.error("❌ Error en updateOrder API:", error);
    console.error("🔥 Error detallado:", {
      message: error instanceof Error ? error.message : "Error desconocido",
      stack: error instanceof Error ? error.stack : "No stack available",
    });
    throw error;
  }
};

/**
 * Actualiza el estado de un pedido
 */
export const updateOrderStatus = async (
  id: number,
  statusData: UpdateOrderStatusRequest
): Promise<{ success: boolean; message: string }> => {
  return await fetcher(`${API_BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusData),
  });
};

/**
 * Asigna un vehículo y un conductor a un pedido
 */
export const assignDelivery = async (
  id: number,
  assignData: AssignDeliveryRequest
): Promise<{ success: boolean; message: string }> => {
  return await fetcher(`${API_BASE}/${id}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignData),
  });
};

/**
 * Elimina un pedido
 */
export const deleteOrder = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  return await fetcher(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
};

/**
 * Obtiene pedidos programados para una fecha específica
 */
export const getScheduledForDate = async (
  date: string
): Promise<OrdersResponse> => {
  return await fetcher(`${API_BASE}/scheduled/${date}`, {
    method: "GET",
  });
};

/**
 * Busca pedidos por término
 */
export const searchOrders = async (
  term: string,
  limit: number = 10
): Promise<OrdersResponse> => {
  return await fetcher(
    `${API_BASE}/search`,
    {
      method: "GET",
    },
    { term, limit }
  );
};

/**
 * Obtiene pedidos pendientes por conductor
 */
export const getPendingByDriver = async (
  driverId: number
): Promise<OrdersResponse> => {
  return await fetcher(`${API_BASE}/driver/${driverId}/pending`, {
    method: "GET",
  });
};

/**
 * Obtiene pedidos pendientes por cliente
 */
export const getPendingByCustomer = async (
  customerId: number
): Promise<OrdersResponse> => {
  return await fetcher(`${API_BASE}/customer/${customerId}/pending`, {
    method: "GET",
  });
};

/**
 * Obtiene todos los productos activos
 */
export const getProducts = async (): Promise<ProductsResponse> => {
  return await fetcher(`${API_BASE}/products`, {
    method: "GET",
  });
};

/**
 * Obtiene estadísticas de pedidos
 */
export const getOrderStats = async (): Promise<StatsResponse> => {
  return await fetcher(`${API_BASE}/stats`, {
    method: "GET",
  });
};

/**
 * Obtiene datos para el dashboard
 */
export const getDashboardData = async (): Promise<DashboardResponse> => {
  return await fetcher(`${API_BASE}/dashboard`, {
    method: "GET",
  });
};
