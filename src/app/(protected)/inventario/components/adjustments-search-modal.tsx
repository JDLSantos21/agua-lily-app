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
import { Excel } from "@/shared/components/Excel";
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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <Search className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                Búsqueda de Ajustes
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Encuentra y filtra ajustes de inventario
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 py-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar material..."
              className="pl-10 h-11 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[180px] h-11 justify-start text-left font-normal border-gray-200 hover:border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[180px] h-11 justify-start text-left font-normal border-gray-200 hover:border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
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

          <Button
            variant="outline"
            onClick={toggleFilters}
            disabled={!materialName && !startDate && !endDate}
            className="h-11 px-4 border-gray-200 hover:border-gray-300"
          >
            <Filter className="mr-2 h-4 w-4" />
            Limpiar
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            className="h-11 px-4 border-gray-200 hover:border-gray-300"
          >
            <Excel />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-200">
                  <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                    Material
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                    Stock Anterior
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                    Valor Ajustado
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                    Fecha & Hora
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                    Motivo
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!adjustments.length && !loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-16 text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-900">
                            No hay ajustes
                          </p>
                          <p className="text-sm text-gray-500">
                            No se encontraron ajustes que coincidan con los
                            filtros
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : loading ? (
                  <AdjustmentSearchSkeleton />
                ) : (
                  adjustments.map((adjustment) => (
                    <TableRow
                      key={adjustment.id}
                      className="hover:bg-gray-50 border-b border-gray-100"
                    >
                      <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">
                        {adjustment.material_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600">
                        {adjustment.previous_stock}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600">
                        {adjustment.quantity}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600">
                        {format(adjustment.created_at, {
                          date: "medium",
                          time: "short",
                        })}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600">
                        {adjustment.reason}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
