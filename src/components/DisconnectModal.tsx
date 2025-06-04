// src/components/DisconnectModal.tsx - VERSIÓN ACTUALIZADA
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DisconnectModalProps {
  isOpen: boolean;
  isReconnecting: boolean;
  onReconnect: () => void;
  reconnectAttempts?: number;
}

export function DisconnectModal({
  isOpen,
  isReconnecting,
  onReconnect,
  reconnectAttempts = 0,
}: DisconnectModalProps) {
  const maxAttempts = 5;
  const isMaxAttemptsReached = reconnectAttempts >= maxAttempts;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            {isReconnecting ? (
              <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
            ) : isMaxAttemptsReached ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-600" />
            )}
          </div>

          <DialogTitle className="text-lg font-semibold">
            {isReconnecting
              ? "Reconectando..."
              : isMaxAttemptsReached
                ? "Conexión perdida"
                : "Sin conexión al servidor"}
          </DialogTitle>

          {/* <DialogDescription className="text-center space-y-2">

          </DialogDescription> */}

          {isReconnecting ? (
            <div className="space-y-2">
              <p>Intentando restablecer la conexión con el servidor...</p>
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Intento {reconnectAttempts} de {maxAttempts}
              </Badge>
            </div>
          ) : isMaxAttemptsReached ? (
            <div className="space-y-2">
              <p>No se pudo conectar al servidor después de varios intentos.</p>
              <p className="text-sm text-gray-600">
                Las actualizaciones en tiempo real no estarán disponibles hasta
                que se restablezca la conexión.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p>Se perdió la conexión con el servidor.</p>
              <p className="text-sm text-gray-600">
                Los datos pueden no actualizarse automáticamente.
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          {!isReconnecting && (
            <Button onClick={onReconnect} className="w-full" variant="primary">
              <Wifi className="w-4 h-4 mr-2" />
              Intentar reconectar
            </Button>
          )}

          {isMaxAttemptsReached && (
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Recargar página
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p>
                <strong>Mientras esté desconectado:</strong>
              </p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>
                  Los cambios de otros usuarios no se verán automáticamente
                </li>
                <li>Las notificaciones en tiempo real no funcionarán</li>
                <li>Puede seguir trabajando normalmente en la aplicación</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
