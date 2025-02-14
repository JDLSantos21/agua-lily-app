"use client";
import { useEffect, useState } from "react";
import { CalendarIcon, Filter, Loader, Search } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFilteredAdjustments } from "@/lib/data";
import { useDebouncedCallback } from "use-debounce";
import { Adjustment } from "@/types/materials/adjustment";
import { Excel } from "../../../../public/excel";

export function AdjustmentsSearchModal() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [materialName, setMaterialName] = useState("");
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(false);

  // Función centralizada para realizar la búsqueda
  const fetchAdjustments = async (name: string, start?: Date, end?: Date) => {
    setLoading(true);
    const data = await fetchFilteredAdjustments({
      material_name: name,
      start_date: start?.toISOString() || "",
      end_date: end?.toISOString() || "",
    });
    setAdjustments(data);
    setLoading(false);
  };

  // Debounce para la búsqueda por nombre de material (300ms de retardo)
  const debouncedFetch = useDebouncedCallback(() => {
    if (open) {
      fetchAdjustments(materialName, startDate, endDate);
    }
  }, 300);

  // Efecto que se dispara al abrir el modal o al cambiar las fechas
  useEffect(() => {
    if (open) {
      fetchAdjustments(materialName, startDate, endDate);
      console.log("Buscando ajustes...", materialName, startDate, endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, startDate, endDate]);

  // Efecto para buscar al cambiar el nombre del material, usando debounce
  useEffect(() => {
    debouncedFetch();
  }, [materialName, debouncedFetch]);

  // Función para activar o desactivar filtros
  const toggleFilters = () => {
    setMaterialName("");
    setStartDate(undefined);
    setEndDate(undefined);
    fetchAdjustments("", undefined, undefined);
  };

  const handleExport = () => {
    // Asegúrate de que 'adjustments' tenga los datos a exportar
    if (!adjustments.length) return;

    const adjustmentsToExport = adjustments.map((adjustment) => ({
      Material: adjustment.material_name,
      "Stock Anterior": adjustment.previous_stock,
      "Valor Ajustado": adjustment.quantity,
      "Fecha de Ajuste": format(new Date(adjustment.created_at), "PPP", {
        locale: es,
      }),
      Motivo: adjustment.reason,
    }));

    // Convierte el arreglo de objetos a una hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(adjustmentsToExport);

    // Crea un nuevo libro de Excel
    const workbook = XLSX.utils.book_new();

    // Agrega la hoja al libro. "Ajustes" es el nombre de la pestaña.
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ajustes");

    // Genera y descarga el archivo Excel. El segundo parámetro es el nombre del archivo.
    XLSX.writeFile(workbook, "ajustes.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="relative flex cursor-default hover:bg-neutral-100 w-full select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50">
        Buscar Ajustes
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] flex flex-col">
        <DialogHeader className="flex ">
          <DialogTitle className="text-gray-700">
            Filtrado de Ajustes
          </DialogTitle>
          <DialogDescription>
            Busca y filtra los ajustes de inventario.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          {/* Input para búsqueda de material */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Material"
              className="pl-8 outline-none"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />
          </div>
          {/* Selector de fecha de inicio */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4 dark:text-white" />
                {startDate
                  ? format(startDate, "PPP", { locale: es })
                  : "Fecha Inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={es}
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                disabled={loading}
              />
            </PopoverContent>
          </Popover>
          {/* Selector de fecha de fin */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4 dark:text-white" />
                {endDate
                  ? format(endDate, "PPP", { locale: es })
                  : "Fecha Final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                locale={es}
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={loading}
              />
            </PopoverContent>
          </Popover>
          {/* Botón para activar/desactivar filtros */}
          <Button
            variant="secondary"
            onClick={toggleFilters}
            disabled={!materialName && !startDate && !endDate}
          >
            <Filter className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
          {/* Botón para exportar */}
          <Button variant="ghost" onClick={handleExport}>
            <Excel />
          </Button>
        </div>
        <div className="flex-1 overflow-auto h-full">
          <Table className="table-fixed h-full">
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Stock Anterior</TableHead>
                <TableHead>Valor Ajustado</TableHead>
                <TableHead>Fecha de Ajuste</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!adjustments.length && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-lg font-medium text-muted-foreground"
                  >
                    No hay ajustes que coincidan con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : loading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex justify-center items-center py-8">
                      <Loader className="h-8 w-8 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                adjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell>{adjustment.material_name}</TableCell>
                    <TableCell>{adjustment.previous_stock}</TableCell>
                    <TableCell>{adjustment.quantity}</TableCell>
                    <TableCell>
                      {format(new Date(adjustment.created_at), "PPP", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>{adjustment.reason}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
