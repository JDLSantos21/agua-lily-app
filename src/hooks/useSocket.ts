// src/hooks/useSocket.ts - VERSIÓN ACTUALIZADA
"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import io, { Socket } from "socket.io-client";

// Configuración
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
const RECONNECT_DELAY = 1000;
const MAX_RECONNECT_ATTEMPTS = 5;

// Eventos que el servidor puede enviar
interface ServerToClientEvents {
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
interface ClientToServerEvents {
  join_room: (room: string) => void;
  leave_room: (room: string) => void;
  ping: () => void;
  request_data_refresh: (entity: string) => void;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const queryClient = useQueryClient();
  const { token, name, user_id, role } = useAuthStore();

  // Inicializar socket
  useEffect(() => {
    if (!token || !name) {
      return;
    }

    console.log("🔌 Inicializando conexión WebSocket...");

    const socketInstance = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      timeout: 20000,
    });

    setSocket(socketInstance);

    // ======================
    // EVENTOS DE CONEXIÓN
    // ======================

    socketInstance.on("connect", () => {
      console.log("✅ Conectado al servidor WebSocket:", socketInstance.id);
      setIsConnected(true);
      setShowDisconnectPopup(false);
      setIsReconnecting(false);
      setReconnectAttempts(0);

      // Unirse automáticamente a salas importantes
      socketInstance.emit("join_room", "orders");
      if (role === "admin") {
        // socketInstance.emit("join_room", "admin");
        socketInstance.emit("join_room", "general");
      }
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Desconectado del servidor WebSocket:", reason);
      setIsConnected(false);
      setShowDisconnectPopup(true);

      // Solo mostrar toast si no es una desconexión intencional
      if (reason !== "io client disconnect") {
        toast.error("Conexión perdida con el servidor", {
          description: "Intentando reconectar...",
          duration: 3000,
        });
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Error de conexión WebSocket:", error);
      setIsConnected(false);
      setShowDisconnectPopup(true);

      setReconnectAttempts((prev) => {
        const newAttempts = prev + 1;
        if (newAttempts >= MAX_RECONNECT_ATTEMPTS) {
          toast.error("No se pudo conectar al servidor", {
            description: "Verifique su conexión a internet",
            duration: 5000,
          });
        }
        return newAttempts;
      });
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      console.log(
        `🔄 Reconectado al servidor WebSocket (intento ${attemptNumber})`
      );
      setIsConnected(true);
      setShowDisconnectPopup(false);
      setIsReconnecting(false);
      setReconnectAttempts(0);

      toast.success("Conexión restablecida", {
        duration: 2000,
      });
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Intento de reconexión ${attemptNumber}`);
      setIsReconnecting(true);
    });

    // ======================
    // EVENTOS DE PEDIDOS
    // ======================

    socketInstance.on("order:created", (data) => {
      console.log("📦 Nuevo pedido creado:", data);

      // Invalidar queries para refrescar listas
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Mostrar notificación
      toast.success(data.message, {
        description: `Cliente: ${data.order.customer_name}`,
        duration: 5000,
        action: {
          label: "Ver pedido",
          onClick: () => {
            // Aquí podrías navegar al pedido específico
            console.log("Navegando al pedido:", data.order.id);
          },
        },
      });
    });

    socketInstance.on("order:updated", (data) => {
      console.log("📝 Pedido actualizado:", data);

      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });

      // Mostrar notificación más sutil para actualizaciones
      toast.info(data.message, {
        duration: 3000,
      });
    });

    socketInstance.on("order:status_changed", (data) => {
      console.log("🔄 Estado de pedido cambiado:", data);

      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });

      // Mostrar notificación con color según el estado
      const statusConfig = {
        entregado: { type: "success" as const, icon: "✅" },
        despachado: { type: "info" as const, icon: "🚛" },
        cancelado: { type: "error" as const, icon: "❌" },
        preparando: { type: "warning" as const, icon: "⏳" },
        pendiente: { type: "info" as const, icon: "📋" },
      };

      const config =
        statusConfig[data.status as keyof typeof statusConfig] ||
        statusConfig.pendiente;

      const toastFn = toast[config.type];
      toastFn(`${config.icon} ${data.message}`, {
        duration: 4000,
      });
    });

    socketInstance.on("order:deleted", (data) => {
      console.log("🗑️ Pedido eliminado:", data);

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.removeQueries({ queryKey: ["order", data.orderId] });

      toast.warning(data.message, {
        duration: 3000,
      });
    });

    // ======================
    // EVENTOS DE SISTEMA
    // ======================

    socketInstance.on("notification", (data) => {
      console.log("🔔 Notificación recibida:", data);

      // Solo mostrar si no es para un usuario específico o es para este usuario
      if (!data.userId || data.userId === user_id) {
        const toastType = data.type as keyof typeof toast;
        const toastFn = toast[toastType];
        toastFn(data.message, {
          description: data.title,
          duration: 4000,
        });
      }
    });

    socketInstance.on("user_count", (count) => {
      setConnectedUsers(count);
    });

    socketInstance.on("user:connected", (data) => {
      console.log("👤 Usuario conectado:", data.name);
      // Notificación sutil para conexiones de usuarios
      if (data.user.id !== user_id) {
        // No notificar nuestra propia conexión
        toast.info(`${data.user.name} se conectó`, {
          duration: 2000,
        });
      }
    });

    socketInstance.on("user:disconnected", (data) => {
      console.log("👤 Usuario desconectado:", data.userId);
      // Podrías agregar lógica aquí si necesitas notificar desconexiones
    });

    return () => {
      console.log("🔌 Cerrando conexión WebSocket...");
      socketInstance.disconnect();
    };
  }, [token, name, queryClient]);

  // ======================
  // MÉTODOS PÚBLICOS
  // ======================

  const reconnect = useCallback(() => {
    if (socket && !isConnected) {
      console.log("🔄 Intentando reconectar manualmente...");
      setIsReconnecting(true);
      socket.connect();
    }
  }, [socket, isConnected]);

  const joinRoom = useCallback(
    (room: string) => {
      if (socket && isConnected) {
        socket.emit("join_room", room);
        console.log(`📡 Unido a sala: ${room}`);
      }
    },
    [socket, isConnected]
  );

  const leaveRoom = useCallback(
    (room: string) => {
      if (socket && isConnected) {
        socket.emit("leave_room", room);
        console.log(`📡 Salido de sala: ${room}`);
      }
    },
    [socket, isConnected]
  );

  const requestDataRefresh = useCallback(
    (entity: string) => {
      if (socket && isConnected) {
        socket.emit("request_data_refresh", entity);
        console.log(`🔄 Solicitando actualización de: ${entity}`);
      }
    },
    [socket, isConnected]
  );

  const ping = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("ping");
      console.log("🏓 Ping enviado");
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    showDisconnectPopup,
    isReconnecting,
    connectedUsers,
    reconnectAttempts,
    reconnect,
    joinRoom,
    leaveRoom,
    requestDataRefresh,
    ping,
  };
}
