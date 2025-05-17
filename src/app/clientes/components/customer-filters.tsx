// src/app/clientes/components/customer-filters.tsx
"use client";

import { useState, useEffect } from "react";
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
import { CustomerFilter } from "@/types/customers.types";
import { useDebounce } from "use-debounce";

interface CustomerFiltersProps {
  onChange: (filters: CustomerFilter) => void;
}

export function CustomerFilters({ onChange }: CustomerFiltersProps) {
  // Estados para los filtros
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isBusinessFilter, setIsBusinessFilter] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 500);

  // Ejecutar la búsqueda cuando cambian los filtros
  useEffect(() => {
    const newFilters: CustomerFilter = {};

    if (debouncedSearch) {
      newFilters.search = debouncedSearch;
    }

    if (status) {
      newFilters.status = status as "activo" | "inactivo";
    }

    if (isBusinessFilter) {
      newFilters.is_business = isBusinessFilter === "true";
    }

    onChange(newFilters);
  }, [debouncedSearch, status, isBusinessFilter]);

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setIsBusinessFilter("");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = !!search || !!status || !!isBusinessFilter;

  return (
    <div className="bg-slate-50 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtro de estado */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de tipo */}
        <Select value={isBusinessFilter} onValueChange={setIsBusinessFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos</SelectItem>
            <SelectItem value="true">Empresas</SelectItem>
            <SelectItem value="false">Individuales</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón para limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
