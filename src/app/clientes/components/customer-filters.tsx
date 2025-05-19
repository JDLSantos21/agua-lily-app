// src/app/clientes/components/customer-filters.tsx - VERSIÓN MEJORADA
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
import { Search, X } from "lucide-react";
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
  const hasActiveFilters = !!search || !!status || !!isBusinessFilter;

  return (
    <div className={`bg-slate-50 p-4 rounded-lg ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar cliente"
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
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de tipo */}
        <Select value={isBusinessFilter} onValueChange={setIsBusinessFilter}>
          <SelectTrigger aria-label="Filtrar por tipo de cliente">
            <SelectValue placeholder="Tipo de cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="true">Empresas</SelectItem>
            <SelectItem value="false">Individuales</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters ? (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-1"
            aria-label="Limpiar todos los filtros"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        ) : (
          <div className="hidden md:block" /> // Espacio vacío para mantener la cuadrícula uniforme
        )}
      </div>
    </div>
  );
});
