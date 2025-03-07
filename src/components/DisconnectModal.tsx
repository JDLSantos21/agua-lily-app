// components/DisconnectModal.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DisconnectModalProps {
  isOpen: boolean;
  isReconnecting: boolean;
  onReconnect: () => void;
}

export function DisconnectModal({
  isOpen,
  isReconnecting,
  onReconnect,
}: DisconnectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-500 text-lg text-center">
            Conexión perdida
          </CardTitle>
          <CardDescription className="text-center">
            No se pudo establecer comunicación con el servidor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onReconnect}
            disabled={isReconnecting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isReconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reconectando...
              </>
            ) : (
              "Reintentar conexión"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
