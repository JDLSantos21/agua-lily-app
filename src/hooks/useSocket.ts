// lib/useSocket.ts
"use client";
import { SOCKET_URL } from "@/api/config";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showDisconnectPopup, setShowDisconnectPopup] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      autoConnect: true,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setShowDisconnectPopup(false); // Ocultar el popup al conectar
      setIsReconnecting(false);
      console.log("Conectado al servidor WebSocket");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setShowDisconnectPopup(true); // Mostrar el popup al desconectarse
    });

    socketInstance.on("reconnect", () => {
      setIsConnected(true);
      setShowDisconnectPopup(false); // Ocultar el popup al reconectar
      setIsReconnecting(false);
    });

    socketInstance.on("connect_error", () => {
      setIsConnected(false);
      setShowDisconnectPopup(true); // Mostrar el popup si hay error
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const reconnect = () => {
    if (socket) {
      setIsReconnecting(true);
      socket.connect();
    }
  };

  return {
    socket,
    isConnected,
    showDisconnectPopup,
    isReconnecting,
    reconnect,
  };
}
