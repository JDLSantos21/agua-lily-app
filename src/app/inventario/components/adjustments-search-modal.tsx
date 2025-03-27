"use client";
import { useEffect, useState } from "react";
import { CalendarIcon, Filter, Search } from "lucide-react";
import { es } from "date-fns/locale";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { fetchFilterAdjustments as searchAdjustments } from "@/api/inventory";
import { useDebouncedCallback } from "use-debounce";
import { Adjustment } from "@/types/materials/adjustment";
import { Excel } from "../../../../public/excel";
import { adjustmentFilter } from "@/types/inventory";
import { toast } from "sonner";
import { AdjustmentSearchSkeleton } from "@/ui/skeletons";
import { format } from "@formkit/tempo";
import { useDialogStore } from "@/stores/dialogStore";

export function AdjustmentsSearchModal() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [materialName, setMaterialName] = useState("");
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(false);
  const { open, openDialog, close } = useDialogStore();

  // Función centralizada para realizar la búsqueda
  const fetchAdjustments = async (filterData: adjustmentFilter) => {
    setLoading(true);

    for (const filter in filterData) {
      const key = filter as keyof adjustmentFilter;
      if (!filterData[key]) {
        delete filterData[key];
      }
    }

    if (filterData.start_date) {
      filterData.start_date = format(filterData.start_date, "YYYY-MM-DD");
    }

    if (filterData.end_date) {
      filterData.end_date = format(filterData.end_date, "YYYY-MM-DD");
    }

    try {
      const data = await searchAdjustments(filterData);
      setAdjustments(data);
    } catch (e) {
      console.log(e);
      toast.error("Ocurrió un error al buscar los ajustes.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce para la búsqueda por nombre de material (300ms de retardo)
  const debouncedFetch = useDebouncedCallback(() => {
    if (openDialog === "search-adjustment") {
      fetchAdjustments({
        material_name: materialName,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, 500);

  // Efecto que se dispara al abrir el modal o al cambiar las fechas
  useEffect(() => {
    if (openDialog === "search-adjustment") {
      fetchAdjustments({
        material_name: materialName,
        start_date: startDate,
        end_date: endDate,
      });
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
    fetchAdjustments({});
  };

  const handleExport = () => {
    // Asegúrate de que 'adjustments' tenga los datos a exportar
    if (!adjustments.length) return;

    const adjustmentsToExport = adjustments.map((adjustment) => ({
      Material: adjustment.material_name,
      "Stock Anterior": adjustment.previous_stock,
      "Valor Ajustado": adjustment.quantity,
      "Fecha de Ajuste": format(new Date(adjustment.created_at), "DD/MM/YYYY"),
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
    <Dialog open={openDialog === "search-adjustment"} onOpenChange={close}>
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
                  ? format(startDate, { date: "medium" })
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
                {endDate ? format(endDate, { date: "medium" }) : "Fecha Final"}
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
          <Table className="table-fixed  h-full">
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Stock Anterior</TableHead>
                <TableHead>Valor Ajustado</TableHead>
                <TableHead>Fecha & Hora</TableHead>
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
                <AdjustmentSearchSkeleton />
              ) : (
                adjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell>{adjustment.material_name}</TableCell>
                    <TableCell>{adjustment.previous_stock}</TableCell>
                    <TableCell>{adjustment.quantity}</TableCell>
                    <TableCell>
                      {format(adjustment.created_at, {
                        date: "medium",
                        time: "short",
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
