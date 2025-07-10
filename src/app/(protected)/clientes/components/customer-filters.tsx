// src/app/clientes/components/customer-filters.tsx - REDISEÑADO
"use client";

import { useCallback, useEffect, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Building2, User } from "lucide-react";
import { CustomerFilter, CustomerStatus } from "@/types/customers.types";
import { useDebounce } from "use-debounce";

interface CustomerFiltersProps {
  onChange: (filters: CustomerFilter) => void;
  initialFilters?: CustomerFilter;
  className?: string;
}

export const CustomerFilters = memo(function CustomerFilters({
  onChange,
  initialFilters = {},
  className = "",
}: CustomerFiltersProps) {
  // Estados para los filtros
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState<string>(
    initialFilters.status || "todos"
  );
  const [isBusinessFilter, setIsBusinessFilter] = useState<string>(
    initialFilters.is_business !== undefined
      ? String(initialFilters.is_business)
      : "todos"
  );
  const [debouncedSearch] = useDebounce(search, 500);

  // Aplicar filtros de forma memoizada para evitar re-renders excesivos
  const applyFilters = useCallback(() => {
    const newFilters: CustomerFilter = {};

    if (debouncedSearch) {
      newFilters.search = debouncedSearch;
    }

    if (status && status !== "todos") {
      newFilters.status = status as CustomerStatus;
    }

    if (isBusinessFilter && isBusinessFilter !== "todos") {
      newFilters.is_business = isBusinessFilter === "true";
    }

    onChange(newFilters);
  }, [debouncedSearch, status, isBusinessFilter, onChange]);

  // Ejecutar la búsqueda cuando cambian los filtros
  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, status, isBusinessFilter, applyFilters]);

  // Limpiar todos los filtros
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatus("todos");
    setIsBusinessFilter("todos");
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters =
    search || status !== "todos" || isBusinessFilter !== "todos";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Buscar por nombre, teléfono o email..."
          className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar cliente"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filtros secundarios */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtro de estado */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] border-gray-200 focus:border-blue-500">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de tipo */}
        <Select value={isBusinessFilter} onValueChange={setIsBusinessFilter}>
          <SelectTrigger className="w-[140px] border-gray-200 focus:border-blue-500">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="true">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Empresas</span>
              </div>
            </SelectItem>
            <SelectItem value="false">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Individuales</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="h-9 px-3 text-sm border-gray-200 hover:bg-gray-50"
            aria-label="Limpiar todos los filtros"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="text-sm text-gray-500">
            {search && <span>Búsqueda activa</span>}
            {status !== "todos" && (
              <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                Estado: {status}
              </span>
            )}
            {isBusinessFilter !== "todos" && (
              <span className="ml-2 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                Tipo:{" "}
                {isBusinessFilter === "true" ? "Empresas" : "Individuales"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
