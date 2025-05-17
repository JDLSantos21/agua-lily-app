// src/app/settings/labels/components/session-history-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReopenDaySession } from "@/hooks/useLabels";
import { RefreshCwIcon } from "lucide-react";

interface SessionHistoryTableProps {
  data: any[];
  isLoading: boolean;
}

export function SessionHistoryTable({
  data,
  isLoading,
}: SessionHistoryTableProps) {
  const reopenDaySessionMutation = useReopenDaySession();

  const handleReopenSession = (date: string) => {
    if (
      window.confirm(
        `¿Está seguro que desea reabrir la sesión del día ${date}?`
      )
    ) {
      reopenDaySessionMutation.mutate(date);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando datos...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">
        No hay sesiones registradas en este periodo
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead>Botellas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creada por</TableHead>
            <TableHead>Cerrada por</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((session) => (
            <TableRow key={session.date}>
              <TableCell className="font-medium">
                {format(new Date(session.date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{session.total_labels}</TableCell>
              <TableCell>{session.total_bottles}</TableCell>
              <TableCell>
                <Badge
                  variant={session.is_closed ? "destructive" : "standardTrip"}
                >
                  {session.is_closed ? "Cerrada" : "Activa"}
                </Badge>
              </TableCell>
              <TableCell>{session.created_by_name}</TableCell>
              <TableCell>{session.closed_by_name || "-"}</TableCell>
              <TableCell className="text-right">
                {session.is_closed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReopenSession(session.date)}
                    disabled={reopenDaySessionMutation.isPending}
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-1" />
                    Reabrir
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
