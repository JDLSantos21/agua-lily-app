"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { EquipmentFilter } from "@/types/equipments.types";

interface EquipmentFiltersProps {
  onFilterChange: (filters: EquipmentFilter) => void;
  isLoading?: boolean;
  className?: string;
}

// Opciones para los selects
const EQUIPMENT_TYPES = [
  { value: "nevera", label: "Neveras" },
  { value: "anaquel", label: "Anaqueles" },
  { value: "otro", label: "Otros" },
];

const EQUIPMENT_STATUS = [
  { value: "disponible", label: "Disponibles" },
  { value: "asignado", label: "Asignados" },
  { value: "mantenimiento", label: "En Mantenimiento" },
  { value: "inhabilitado", label: "Inhabilitados" },
];

export function EquipmentFilters({
  onFilterChange,
  isLoading = false,
  className = "",
}: EquipmentFiltersProps) {
  const [filters, setFilters] = useState<EquipmentFilter>({
    type: "",
    status: "",
    search: "",
  });

  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Verificar si hay filtros activos
  useEffect(() => {
    const active = !!(filters.type || filters.status || filters.search);
    setHasActiveFilters(active);
  }, [filters]);

  // Aplicar filtros con debounce para el search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Limpiar valores vacíos antes de enviar
      const cleanedFilters: EquipmentFilter = {};
      if (filters.type) cleanedFilters.type = filters.type;
      if (filters.status) cleanedFilters.status = filters.status;
      if (filters.search) cleanedFilters.search = filters.search;

      onFilterChange(cleanedFilters);
    }, 300); // 300ms debounce para búsqueda

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof EquipmentFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      status: "",
      search: "",
    });
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex gap-4">
        {/* Primera fila: Búsqueda */}
        <div className="space-y-2 w-2/5">
          <Label htmlFor="search" className="text-sm font-medium">
            Búsqueda general
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="search"
              placeholder="Buscar por serie, modelo, marca o cliente..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Segunda fila: Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-2/5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Tipo de Equipo
            </Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Estado
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tercera fila: Botones de acción */}
        <div className="flex flex-col justify-center w-1/5 space-y-2">
          {hasActiveFilters && (
            <>
              <Label className="text-sm font-medium">Acciones</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={isLoading}
                className="gap-2 h-10"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
