// src/api/orders.ts
import { api } from "@/services/api";
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

/**
 * Obtiene todos los pedidos con filtros opcionales
 */
export const getOrders = async (
  filters?: OrderFilter
): Promise<OrdersResponse> => {
  const res = await api.get("/orders", { params: filters });
  return res.data;
};

/**
 * Obtener pedidos del recibidor de pedidos en tiempo real.
 */

export const getOrdersForReceiver = async (
  filters?: OrderFilter
): Promise<OrdersResponse> => {
  const res = await api.get("/orders/receiver", { params: filters });
  return res.data;
};

/**
 * Obtiene un pedido por su ID
 */
export const getOrderById = async (id: number): Promise<OrderResponse> => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

/**
 * Obtiene un pedido por su código de seguimiento
 */
export const getOrderByTrackingCode = async (
  trackingCode: string
): Promise<OrderResponse> => {
  const res = await api.get(`/orders/track/${trackingCode}`);
  return res.data;
};

/**
 * Crea un nuevo pedido
 */
export const createOrder = async (
  order: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const res = await api.post(`/orders`, order);
  return res.data;
};

/**
 * Actualiza un pedido existente
 */
export const updateOrder = async (
  id: number,
  order: Partial<Order>
): Promise<{ success: boolean; message: string }> => {
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

  const res = await api.put(`/orders/${id}`, cleanData);
  return res.data;
};

/**
 * Actualiza el estado de un pedido
 */
export const updateOrderStatus = async (
  id: number,
  statusData: UpdateOrderStatusRequest
): Promise<{ success: boolean; message: string }> => {
  const res = await api.patch(`/orders/${id}/status`, statusData);
  return res.data;
};

/**
 * Asigna un vehículo y un conductor a un pedido
 */
export const assignDelivery = async (
  id: number,
  assignData: AssignDeliveryRequest
): Promise<{ success: boolean; message: string }> => {
  const res = await api.patch(`/orders/${id}/assign`, assignData);

  return res.data;
};

/**
 * Elimina un pedido
 */
export const deleteOrder = async (
  id: number
): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/orders/${id}`);
  return res.data;
};

/**
 * Obtiene pedidos programados para una fecha específica
 */
export const getScheduledForDate = async (
  date: string
): Promise<OrdersResponse> => {
  const res = await api.get(`/orders/scheduled/${date}`);
  return res.data;
};

/**
 * Busca pedidos por término
 */
export const searchOrders = async (
  term: string,
  limit: number = 10
): Promise<OrdersResponse> => {
  const res = await api.get(`/orders/search`, { params: { term, limit } });
  return res.data;
};

/**
 * Obtiene pedidos pendientes por conductor
 */
export const getPendingByDriver = async (
  driverId: number
): Promise<OrdersResponse> => {
  const res = await api.get(`/orders/driver/${driverId}/pending`);
  return res.data;
};

/**
 * Obtiene pedidos pendientes por cliente
 */
export const getPendingByCustomer = async (
  customerId: number
): Promise<OrdersResponse> => {
  const res = await api.get(`/orders/customer/${customerId}/pending`);
  return res.data;
};

/**
 * Obtiene todos los productos activos
 */
export const getProducts = async (): Promise<ProductsResponse> => {
  const res = await api.get(`/orders/products`);
  return res.data;
};

/**
 * Obtiene estadísticas de pedidos
 */
export const getOrderStats = async (): Promise<StatsResponse> => {
  const res = await api.get(`/orders/stats`);
  return res.data;
};

/**
 * Obtiene datos para el dashboard
 */
export const getDashboardData = async (): Promise<DashboardResponse> => {
  const res = await api.get("/orders/dashboard");
  return res.data;
};
