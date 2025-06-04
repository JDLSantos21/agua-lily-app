// src/components/SocketProvider.tsx - VERSIÓN ACTUALIZADA
"use client";

import { useSocket } from "@/hooks/useSocket";
import { DisconnectModal } from "@/components/DisconnectModal";
import { useAuthStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, WifiOff } from "lucide-react";

export function SocketProvider() {
  const {
    showDisconnectPopup,
    isReconnecting,
    reconnect,
    isConnected,
    connectedUsers,
    reconnectAttempts,
  } = useSocket();

  const { name } = useAuthStore();

  // Solo mostrar si hay usuario autenticado
  if (!name) {
    return null;
  }

  return (
    <>
      {/* Modal de desconexión */}
      <DisconnectModal
        isOpen={showDisconnectPopup}
        isReconnecting={isReconnecting}
        onReconnect={reconnect}
        reconnectAttempts={reconnectAttempts}
      />

      {/* Indicador de estado de conexión en tiempo real */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* Estado de conexión */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm shadow-lg border transition-all duration-300 ${
            isConnected
              ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100"
              : isReconnecting
                ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {isConnected ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}

          <span className="font-medium">
            {isConnected
              ? "En línea"
              : isReconnecting
                ? "Reconectando..."
                : "Sin conexión"}
          </span>

          {/* Indicador de actividad (pulso) */}
          {(isConnected || isReconnecting) && (
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                isConnected ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
          )}
        </div>

        {/* Contador de usuarios conectados */}
        {isConnected && connectedUsers > 0 && (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            <span>
              {connectedUsers} usuario{connectedUsers !== 1 ? "s" : ""} activo
              {connectedUsers !== 1 ? "s" : ""}
            </span>
          </Badge>
        )}
      </div>
    </>
  );
}
