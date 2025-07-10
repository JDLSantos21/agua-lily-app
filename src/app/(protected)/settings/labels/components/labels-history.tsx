// src/app/labels/history/components/labels-history.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "./date-picker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { labelService } from "@/services/labelService";
import { Label } from "@/types/label.types";
import { format } from "date-fns";
import { Printer, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function LabelsHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<string>("");

  const fetchLabels = async () => {
    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const filters = {
        date: formattedDate,
        ...(status != "all" ? { status } : {}),
      };

      const fetchedLabels = await labelService.getFilteredLabels(filters);
      setLabels(fetchedLabels);
    } catch (error) {
      console.error("Error fetching labels:", error);
      toast.error("Error al cargar las etiquetas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handlePrintLabel = async (labelId: number) => {
    try {
      await labelService.printLabel(labelId);
      toast.success("Etiqueta enviada a imprimir");
    } catch (error) {
      console.error("Error printing label:", error);
      toast.error("Error al imprimir la etiqueta");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "success", label: "Activa" },
      printed: { color: "secondary", label: "Impresa" },
      canceled: { color: "destructive", label: "Cancelada" },
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default",
      label: status,
    };

    return <Badge variant={config.color as any}>{config.label}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Historial de etiquetas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <div className="flex gap-2">
                <DatePicker
                  date={selectedDate}
                  setDate={setSelectedDate}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="printed">Impresas</SelectItem>
                  <SelectItem value="canceled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={fetchLabels}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Buscar
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Secuencia</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      {isLoading ? (
                        <div className="flex justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          No se encontraron etiquetas
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  labels.map((label) => (
                    <TableRow key={label.id}>
                      <TableCell className="font-medium">
                        {label.sequence_number}
                      </TableCell>
                      <TableCell>{label.quantity}</TableCell>
                      <TableCell>
                        {format(new Date(label.created_at), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{label.user_name}</TableCell>
                      <TableCell>{getStatusBadge(label.status)}</TableCell>
                      <TableCell className="text-right">
                        {label.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintLabel(label.id)}
                            className="h-8 gap-1"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Imprimir</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
