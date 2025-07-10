// src/app/settings/labels/components/session-manager-panel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./date-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReopenDaySession, useLabelStats } from "@/hooks/useLabels";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  HistoryIcon,
  RefreshCcw,
  AlertTriangleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionHistoryTable } from "./session-history-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { confirm } from "@tauri-apps/plugin-dialog";

export default function SessionManagerPanel() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showHistory, setShowHistory] = useState(false);

  const reopenDaySessionMutation = useReopenDaySession();
  const userRole = useAuthStore((state) => state.role);

  const { data: labelStats, isLoading } = useLabelStats(
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd")
  );

  // Solo mostrar para administradores
  if (userRole !== "admin") {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Acceso restringido</AlertTitle>
        <AlertDescription>
          Esta sección solo está disponible para administradores del sistema.
        </AlertDescription>
      </Alert>
    );
  }

  const handleReopenSession = async () => {
    if (!date) return;

    const formattedDate = format(date, "yyyy-MM-dd");

    const isConfirm = await confirm(
      "¿Está seguro que desea reabrir la sesión del día " +
        formattedDate +
        "? Esta es una operación administrativa."
    );

    if (isConfirm) {
      reopenDaySessionMutation.mutate(formattedDate, {
        onSuccess: () => setDate(undefined),
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Panel para reabrir sesión */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-yellow-800 flex items-center gap-2">
              <RefreshCcw className="h-5 w-5" />
              Reabrir Sesión
            </CardTitle>
            <CardDescription>
              Permite reabrir una sesión cerrada para realizar ajustes. Use con
              precaución.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Seleccione la fecha:
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date
                        ? format(date, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                variant="destructive"
                onClick={handleReopenSession}
                disabled={!date || reopenDaySessionMutation.isPending}
                className="w-full"
              >
                {reopenDaySessionMutation.isPending
                  ? "Reabriendo..."
                  : "Reabrir Sesión"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Panel para ver historial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
              <HistoryIcon className="h-5 w-5" />
              Historial de Sesiones
            </CardTitle>
            <CardDescription>
              Consulta el historial de sesiones de etiquetas para análisis y
              seguimiento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha inicial:
                  </label>
                  <DatePicker
                    date={startDate}
                    setDate={setStartDate}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Fecha final:
                  </label>
                  <DatePicker
                    date={endDate}
                    setDate={setEndDate}
                    className="w-full"
                  />
                </div>
              </div>

              <Button
                variant="default"
                onClick={() => setShowHistory(true)}
                className="w-full"
              >
                Ver Historial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de sesiones */}
      {showHistory && labelStats && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Historial de sesiones</CardTitle>
              <CardDescription>
                Periodo: {format(startDate, "dd/MM/yyyy")} -{" "}
                {format(endDate, "dd/MM/yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SessionHistoryTable data={labelStats} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
