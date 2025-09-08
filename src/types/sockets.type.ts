// Eventos que el servidor puede enviar
export interface ServerToClientEvents {
  // Eventos de pedidos
  "order:created": (data: {
    order: any;
    message: string;
    timestamp: number;
  }) => void;
  "order:updated": (data: {
    orderId: number;
    order: any;
    message: string;
    timestamp: number;
  }) => void;
  "order:status_changed": (data: {
    orderId: number;
    status: string;
    message: string;
    trackingCode: string;
    timestamp: number;
  }) => void;
  "order:deleted": (data: {
    orderId: number;
    trackingCode: string;
    message: string;
    timestamp: number;
  }) => void;

  // Eventos de sistema
  notification: (data: {
    type: "success" | "info" | "warning" | "error";
    message: string;
    title?: string;
    timestamp: number;
    userId?: number;
  }) => void;
  user_count: (count: number) => void;
  "user:connected": (data: {
    user: any;
    message: string;
    timestamp: number;
  }) => void;
  "user:disconnected": (data: {
    userId: number;
    message: string;
    timestamp: number;
  }) => void;
}

// Eventos que el cliente puede enviar
export interface ClientToServerEvents {
  join_room: (room: string) => void;
  leave_room: (room: string) => void;
  ping: () => void;
  request_data_refresh: (entity: string) => void;
}
