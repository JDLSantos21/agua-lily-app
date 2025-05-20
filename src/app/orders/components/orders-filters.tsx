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
import { DatePicker } from "@/app/settings/labels/components/date-picker";
import { CalendarIcon, Search, X, Filter } from "lucide-react";
import { OrderFilter, OrderStatus } from "@/types/orders.types";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className={className}>
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 ${hasActiveFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""}`}
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {Object.keys(initialFilters).length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Filtros Avanzados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-xs font-medium">
                    Búsqueda
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="search"
                      placeholder="Buscar pedido..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                        aria-label="Limpiar búsqueda"
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-xs font-medium">
                    Estado
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
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
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Fechas</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-gray-500">Desde</span>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Hasta</span>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">
                    Entrega programada
                  </label>
                  <DatePicker date={scheduledDate} setDate={setScheduledDate} />
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Limpiar todo
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsFiltersOpen(false)}
                  >
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className={`bg-slate-50 p-4 rounded-lg ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar pedido, cliente, código de seguimiento..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar pedido"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtro de estado */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger aria-label="Filtrar por estado">
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

        {/* Botones de acción */}
        <div className="md:col-span-2 flex justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1">
                <CalendarIcon className="h-4 w-4" />
                Más filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rango de fechas</label>
                  <div className="grid grid-cols-2 gap-2">
                    <DatePicker date={startDate} setDate={setStartDate} />
                    <DatePicker date={endDate} setDate={setEndDate} />
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
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              aria-label="Limpiar todos los filtros"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default OrderFilters;
