"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { VehicleFilters } from "@/types/vehicles";

interface VehicleFiltersProps {
  onFiltersChange: (filters: VehicleFilters) => void;
}

export function VehicleFiltersComponent({
  onFiltersChange,
}: VehicleFiltersProps) {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  // Debounce filter changes to avoid too many API calls
  const debouncedFiltersChange = useDebouncedCallback(
    (newFilters: VehicleFilters) => {
      onFiltersChange(newFilters);
    },
    300
  );

  const handleFilterChange = (key: keyof VehicleFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value.trim() !== ""
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros de búsqueda
            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {
                  Object.values(filters).filter((v) => v && v.trim() !== "")
                    .length
                }
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="gap-2"
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {isOpen ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle_id">ID del Vehículo</Label>
              <Input
                id="vehicle_id"
                placeholder="Ej: 1"
                value={filters.vehicle_id || ""}
                onChange={(e) =>
                  handleFilterChange("vehicle_id", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_tag">Tag Actual</Label>
              <Input
                id="current_tag"
                placeholder="Ej: F-01"
                value={filters.current_tag || ""}
                onChange={(e) =>
                  handleFilterChange("current_tag", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_plate">Placa</Label>
              <Input
                id="license_plate"
                placeholder="Ej: ABC123"
                value={filters.license_plate || ""}
                onChange={(e) =>
                  handleFilterChange("license_plate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chasis">Chasis</Label>
              <Input
                id="chasis"
                placeholder="Ej: 1234567890"
                value={filters.chasis || ""}
                onChange={(e) => handleFilterChange("chasis", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                placeholder="Ej: Corolla"
                value={filters.model || ""}
                onChange={(e) => handleFilterChange("model", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                placeholder="Ej: Toyota"
                value={filters.brand || ""}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
