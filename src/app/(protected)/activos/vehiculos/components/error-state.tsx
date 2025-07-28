"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar los vehículos</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || "Ha ocurrido un error inesperado"}
        </AlertDescription>
        <Button onClick={onRetry} className="mt-4 gap-2" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </Alert>
    </div>
  );
}
