// src/components/orders/OrderFilters.tsx
import { useState, useCallback, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/app/(protected)/settings/labels/components/date-picker";
import { CalendarIcon, Search, X, Filter } from "lucide-react";
import { OrderFilter, OrderStatus } from "@/types/orders.types";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OrderFiltersProps {
  onChange: (filters: OrderFilter) => void;
  initialFilters?: OrderFilter;
  className?: string;
  compact?: boolean;
}

const OrderFilters = memo(function OrderFilters({
  onChange,
  initialFilters = {},
  className = "",
  compact = false,
}: OrderFiltersProps) {
  // Estados para los filtros
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState<string>(
    initialFilters.order_status || "todos"
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialFilters.start_date ? new Date(initialFilters.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialFilters.end_date ? new Date(initialFilters.end_date) : undefined
  );
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    initialFilters.scheduled_date
      ? new Date(initialFilters.scheduled_date)
      : undefined
  );
  const [debouncedSearch] = useDebounce(search, 500);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Aplicar filtros de forma memoizada para evitar re-renders excesivos
  const applyFilters = useCallback(() => {
    const newFilters: OrderFilter = {};

    if (debouncedSearch) {
      newFilters.search = debouncedSearch;
    }

    if (status && status !== "todos") {
      newFilters.order_status = status as OrderStatus;
    } else if (status === "todos") {
      delete newFilters.order_status;
    }

    if (startDate) {
      newFilters.start_date = format(startDate, "yyyy-MM-dd");
    }

    if (endDate) {
      newFilters.end_date = format(endDate, "yyyy-MM-dd");
    }

    if (scheduledDate) {
      newFilters.scheduled_date = format(scheduledDate, "yyyy-MM-dd");
    }

    onChange(newFilters);
  }, [debouncedSearch, status, startDate, endDate, scheduledDate, onChange]);

  // Ejecutar la búsqueda cuando cambian los filtros
  useEffect(() => {
    applyFilters();
  }, [
    debouncedSearch,
    status,
    startDate,
    endDate,
    scheduledDate,
    applyFilters,
  ]);

  // Limpiar todos los filtros
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatus("todos");
    setStartDate(undefined);
    setEndDate(undefined);
    setScheduledDate(undefined);
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters =
    !!search ||
    status !== "todos" ||
    !!startDate ||
    !!endDate ||
    !!scheduledDate;

  // Si es compacto, mostrar solo un botón de filtro
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Campo de búsqueda rápida */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Buscar pedidos..."
            className="pl-10 bg-white border-gray-300 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botón de filtros avanzados */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 bg-white border-gray-300 shadow-sm ${
                hasActiveFilters
                  ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {
                    [
                      search,
                      status !== "todos",
                      startDate,
                      endDate,
                      scheduledDate,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 shadow-lg border-gray-200"
            align="start"
          >
            <div className="bg-white rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">
                  Filtros Avanzados
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Estado */}
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="text-xs font-medium text-gray-700"
                  >
                    Estado del pedido
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger
                      id="status"
                      className="bg-white border-gray-300"
                    >
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="preparando">Preparando</SelectItem>
                      <SelectItem value="despachado">Despachado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rango de fechas */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">
                    Rango de fechas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Desde
                      </span>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 mb-1 block">
                        Hasta
                      </span>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                </div>

                {/* Fecha programada */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">
                    Entrega programada
                  </label>
                  <DatePicker date={scheduledDate} setDate={setScheduledDate} />
                </div>

                {/* Acciones */}
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Limpiar todo
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsFiltersOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Campo de búsqueda expandido */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Buscar por código, cliente, o descripción..."
            className="pl-10 bg-white border-gray-300 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar pedido"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtro de estado */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            aria-label="Filtrar por estado"
            className="bg-white border-gray-300 shadow-sm"
          >
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="preparando">Preparando</SelectItem>
            <SelectItem value="despachado">Despachado</SelectItem>
            <SelectItem value="entregado">Entregado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de fecha programada */}
        <DatePicker date={scheduledDate} setDate={setScheduledDate} />
      </div>

      {/* Filtros adicionales y acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-gray-200">
        {/* Filtros de rango de fechas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`gap-2 bg-white border-gray-300 shadow-sm ${
                startDate || endDate
                  ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Rango de fechas</span>
              {(startDate || endDate) && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  1
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 shadow-lg border-gray-200"
            align="start"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Rango de fechas de creación
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">
                      Desde
                    </span>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 mb-1 block">
                      Hasta
                    </span>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            aria-label="Limpiar todos los filtros"
          >
            <X className="h-4 w-4" />
            <span>Limpiar filtros</span>
          </Button>
        )}
      </div>
    </div>
  );
});

export default OrderFilters;
