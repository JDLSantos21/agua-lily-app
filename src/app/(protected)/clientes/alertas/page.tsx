"use client";

import { useState, useMemo, useCallback } from "react";
import { useInactiveCustomers } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoaderSpin } from "@/components/Loader";
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { InactiveCustomerCard } from "../components/inactive-customer-card";

const DAYS_OPTIONS = [
  { value: 7, label: "7 días (1 semana)" },
  { value: 14, label: "14 días (2 semanas)" },
  { value: 21, label: "21 días (3 semanas)" },
  { value: 30, label: "30 días (1 mes)" },
];

type SortOption = "days" | "name" | "equipments";

export default function ClientesAlertasPage() {
  const [daysThreshold, setDaysThreshold] = useState(14);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("days");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Fetch data
  const { data, isLoading, error, refetch } =
    useInactiveCustomers(daysThreshold);

  // Filtrar y ordenar clientes
  const filteredAndSortedCustomers = useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.business_name?.toLowerCase().includes(term) ||
          customer.contact_phone.includes(term)
      );
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "days":
          return b.max_days_without_order - a.max_days_without_order;
        case "name":
          const nameA = a.business_name || a.name;
          const nameB = b.business_name || b.name;
          return nameA.localeCompare(nameB);
        case "equipments":
          return b.inactive_equipments.length - a.inactive_equipments.length;
        default:
          return 0;
      }
    });

    return sorted;
  }, [data?.data, searchTerm, sortBy]);

  // Toggle expand/collapse
  const toggleCard = useCallback((customerId: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(customerId)) {
        next.delete(customerId);
      } else {
        next.add(customerId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (filteredAndSortedCustomers.length > 0) {
      setExpandedCards(new Set(filteredAndSortedCustomers.map((c) => c.id)));
    }
  }, [filteredAndSortedCustomers]);

  const collapseAll = useCallback(() => {
    setExpandedCards(new Set());
  }, []);

  // Renderizado de error
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-medium">Error al cargar alertas</p>
          </div>
          <p className="text-sm text-red-600">
            No se pudieron cargar los datos. Verifique su conexión.
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Alertas de Clientes Inactivos
            </h1>
            <p className="text-sm text-gray-500">
              Clientes con equipos que no han realizado pedidos
            </p>
          </div>
        </div>

        {data && data.count > 0 && (
          <Badge variant="destructive" className="text-base px-4 py-2">
            {data.count} alerta{data.count !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Selector de días */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Período sin pedidos
            </label>
            <Select
              value={daysThreshold.toString()}
              onValueChange={(value) => setDaysThreshold(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Búsqueda */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Buscar cliente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nombre, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Ordenar */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ordenar por
            </label>
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Días sin pedido</SelectItem>
                <SelectItem value="name">Nombre alfabético</SelectItem>
                <SelectItem value="equipments">Cantidad de equipos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Acciones rápidas */}
        {filteredAndSortedCustomers.length > 0 && (
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={expandAll}
              className="text-xs"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Expandir todos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={collapseAll}
              className="text-xs"
            >
              <ChevronUp className="h-3 w-3 mr-1" />
              Colapsar todos
            </Button>
          </div>
        )}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <LoaderSpin text="Cargando alertas..." />
      ) : filteredAndSortedCustomers.length === 0 ? (
        // Estado vacío
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-emerald-900 mb-2">
            ¡Excelente! Todos los clientes están activos
          </h3>
          <p className="text-emerald-700 max-w-md mx-auto">
            No hay clientes con equipos que hayan dejado de ordenar en los
            últimos {daysThreshold} días
          </p>
        </div>
      ) : (
        // Lista de clientes
        <div className="columns-1 lg:columns-2 gap-4 space-y-4">
          {filteredAndSortedCustomers.map((customer) => (
            <div key={customer.id} className="break-inside-avoid">
              <InactiveCustomerCard
                customer={customer}
                isExpanded={expandedCards.has(customer.id)}
                onToggle={() => toggleCard(customer.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
