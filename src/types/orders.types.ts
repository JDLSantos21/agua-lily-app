// src/types/orders.types.ts
export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "despachado"
  | "entregado"
  | "cancelado";

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  notes?: string;
  unit?: string;
  size?: string;
}

export interface Order {
  id?: number;
  tracking_code?: string;
  customer_id?: number | null;
  customer_name: string;
  customer_display_name?: string;
  customer_phone: string;
  customer_address: string;
  order_date?: string;
  scheduled_delivery_date?: string;
  delivery_time_slot?: string | null;
  order_status?: OrderStatus;
  delivery_driver_id?: number | null;
  vehicle_id?: number | null;
  driver_name?: string;
  vehicle_tag?: string;
  delivery_notes?: string | null;
  notes?: string | null;
  created_by?: number;
  items?: OrderItem[];
  status_history?: OrderStatusHistoryEntry[];
}

export interface OrderStatusHistoryEntry {
  id: number;
  order_id: number;
  status: OrderStatus;
  notes: string | null;
  updated_by: number;
  updated_by_name?: string;
  created_at: string;
}

export interface OrderFilter {
  search?: string;
  order_status?: OrderStatus | "all";
  customer_id?: number;
  delivery_driver_id?: number;
  vehicle_id?: number;
  start_date?: string;
  end_date?: string;
  scheduled_date?: string;
  limit?: number;
  offset?: number;
  order_by?: string;
  order_direction?: "ASC" | "DESC";
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  unit: string;
  size?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderStats {
  total_pedidos: number;
  pedidos_pendientes: number;
  pedidos_preparando: number;
  pedidos_despachados: number;
  pedidos_entregados: number;
  pedidos_cancelados: number;
  clientes_unicos: number;
  por_dia_semana?: Array<{
    dia_semana: number;
    cantidad: number;
  }>;
  productos_populares?: Array<{
    id: number;
    name: string;
    cantidad_total: number;
  }>;
}

export interface DashboardData {
  recent_orders: Order[];
  status_counts: Array<{
    order_status: OrderStatus;
    count: number;
  }>;
  today_scheduled: number;
  daily_totals: Array<{
    date: string;
    count: number;
  }>;
}

export interface PaginationInfo {
  total: number;
  limit: number | null;
  offset: number;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: PaginationInfo;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface StatsResponse {
  success: boolean;
  data: OrderStats;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    tracking_code: string;
  };
}

export interface CreateOrderRequest {
  customer_id?: number | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  scheduled_delivery_date?: string;
  delivery_time_slot?: string | null;
  order_status?: OrderStatus;
  delivery_driver_id?: number | null;
  vehicle_id?: number | null;
  delivery_notes?: string | null;
  notes?: string | null;
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string | null;
}

export interface AssignDeliveryRequest {
  delivery_driver_id: number;
  vehicle_id: number;
}

export interface ErrorResponse {
  success: boolean;
  error: string | object;
}
