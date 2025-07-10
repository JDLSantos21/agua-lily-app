"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CalendarDays,
  CalendarRange,
  RefreshCcw,
  Search,
  Truck,
  Filter,
  CalendarClock,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { calculateFortnightDates } from "@/utils/calculateFortnightDays";
import { useTripStore } from "@/stores/tripStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehiclesQuery } from "@/hooks/useVehiclesQuery";
import { Vehicle } from "@/types/vehicles";
import { months } from "@/const";
import { TripFilters } from "@/hooks/useTripReports";

const CURRENT_YEAR = new Date().getFullYear();

const years = Array.from({ length: 5 }, (_, i) => ({
  value: (CURRENT_YEAR - i).toString(),
  label: (CURRENT_YEAR - i).toString(),
}));

export default function TripsFilter() {
  const { handleSubmit, setValue, watch, control, reset } =
    useForm<TripFilters>({
      defaultValues: {
        vehicle_id: "",
        start_date: "",
        end_date: "",
      },
    });

  const [dateFilterType, setDateFilterType] = useState<"quincena" | "rango">(
    "quincena"
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedPeriod, setSelectedPeriod] = useState<"primera" | "segunda">(
    "primera"
  );

  const { setActiveFilters, setShowResults } = useTripStore();
  const { data: vehicles, isLoading, error } = useVehiclesQuery();

  const onSubmit = async (data: TripFilters) => {
    const finalFilters = { ...data };

    if (dateFilterType === "quincena") {
      if (!selectedMonth || !selectedYear) {
        toast.error("Por favor, selecciona un mes y un año.");
        return;
      }

      const { end_date, start_date } = calculateFortnightDates(
        selectedYear,
        selectedMonth,
        selectedPeriod
      );

      finalFilters.start_date = start_date;
      finalFilters.end_date = end_date;
    } else {
      if (!data.start_date && !data.end_date) {
        toast.error("Por favor, selecciona un rango de fechas.");
        return;
      }
    }

    // Establecer los filtros activos y mostrar resultados
    setActiveFilters(finalFilters);
    setShowResults(true);
  };

  const handleFiltersReset = () => {
    reset();
    setSelectedMonth("");
    setSelectedYear(CURRENT_YEAR.toString());
    setSelectedPeriod("primera");
    setDateFilterType("quincena");
    setActiveFilters(null);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Filtros de Búsqueda</h3>
            <p className="text-sm text-gray-500">Cargando opciones...</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-3 text-red-600">
          <div className="p-2 bg-red-50 rounded-lg">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Error al cargar filtros</h3>
            <p className="text-sm text-red-500">
              No se pudieron cargar los vehículos disponibles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-yellow-100 shadow-sm p-6">
        <div className="flex items-center gap-3 text-yellow-600">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Sin vehículos disponibles</h3>
            <p className="text-sm text-yellow-600">
              No hay vehículos registrados para filtrar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Filter className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Filtros de Búsqueda</h3>
          <p className="text-sm text-gray-500">
            Configura los criterios para filtrar los viajes
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Vehicle and Date Type Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Truck className="h-4 w-4 text-gray-500" />
                Vehículo
              </Label>
              <Controller
                name="vehicle_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles?.map((vehicle: Vehicle) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.id.toString()}
                        >
                          {vehicle.current_tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Date Filter Type */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarClock className="h-4 w-4 text-gray-500" />
                Tipo de Filtro
              </Label>
              <RadioGroup
                value={dateFilterType}
                onValueChange={(value) =>
                  setDateFilterType(value as "quincena" | "rango")
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="quincena"
                    id="quincena"
                    className="border-gray-300"
                  />
                  <Label
                    htmlFor="quincena"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Por Quincena
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="rango"
                    id="rango"
                    className="border-gray-300"
                  />
                  <Label
                    htmlFor="rango"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Rango de Fechas
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Date Selection Section */}
          <div className="bg-gray-50 rounded-lg p-4 transition-all duration-200">
            {dateFilterType === "quincena" ? (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Selección por Quincena
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Month */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Mes
                    </Label>
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Año
                    </Label>
                    <Select
                      value={selectedYear}
                      onValueChange={setSelectedYear}
                    >
                      <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Period */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Quincena
                    </Label>
                    <Select
                      value={selectedPeriod}
                      onValueChange={setSelectedPeriod as any}
                    >
                      <SelectTrigger className="h-11 bg-white border-gray-200 focus:border-blue-500">
                        <SelectValue placeholder="Periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primera">Primera (1-15)</SelectItem>
                        <SelectItem value="segunda">Segunda (16-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarRange className="h-4 w-4" />
                  Selección por Rango
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Fecha Inicial
                    </Label>
                    <Input
                      type="date"
                      value={watch("start_date")}
                      onChange={(e) => setValue("start_date", e.target.value)}
                      className="h-11 bg-white border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Fecha Final
                    </Label>
                    <Input
                      type="date"
                      value={watch("end_date")}
                      onChange={(e) => setValue("end_date", e.target.value)}
                      className="h-11 bg-white border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-100">
            <Button
              className="flex items-center justify-center gap-2 h-11 px-6 text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-200"
              variant="outline"
              type="button"
              onClick={handleFiltersReset}
            >
              <RefreshCcw className="h-4 w-4" />
              Limpiar filtros
            </Button>
            <Button
              className="flex items-center justify-center gap-2 h-11 px-8 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20"
              type="submit"
            >
              <Search className="h-4 w-4" />
              Buscar viajes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
