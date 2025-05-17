// components/ReopenSessionPanel.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useReopenDaySession } from "@/hooks/useLabels";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReopenSessionPanel() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const reopenDaySessionMutation = useReopenDaySession();
  const userRole = useAuthStore((state) => state.role);

  // Solo mostrar para administradores
  if (userRole !== "admin") {
    return null;
  }

  const handleReopenSession = () => {
    if (!date) {
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    if (
      window.confirm(
        `¿Está seguro que desea reabrir la sesión del día ${format(date, "dd/MM/yyyy")}? Esta es una operación administrativa.`
      )
    ) {
      reopenDaySessionMutation.mutate(formattedDate);
    }
  };

  return (
    <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        Administración - Reabrir Sesión
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        Esta función está restringida a administradores. Use con precaución.
      </p>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Seleccione la fecha:</label>
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
        >
          {reopenDaySessionMutation.isPending
            ? "Reabriendo..."
            : "Reabrir Sesión"}
        </Button>
      </div>
    </div>
  );
}
