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
  Calendar,
  LucideCalendarRange,
  RefreshCcw,
  Search,
} from "lucide-react";
import { getTrips } from "@/api/trips";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { calculateFortnightDates } from "@/utils/calculateFortnightDays";
import { NonInteractiveLoader } from "@/components/non-interactive-loader";
import { useTripStore } from "@/stores/tripStore";
import { CiCalendarDate } from "react-icons/ci";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { TbCalendarMonth } from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehiclesQuery } from "@/hooks/useVehiclesQuery";
import { Vehicle } from "@/types/vehicles";
import { months } from "@/const";
// Datos para los selects de mes y año

const CURRENT_YEAR = new Date().getFullYear();

const years = Array.from({ length: 5 }, (_, i) => ({
  value: (CURRENT_YEAR - i).toString(),
  label: (CURRENT_YEAR - i).toString(),
}));

export default function TripsFilter() {
  const { handleSubmit, setValue, watch, control, reset } = useForm({
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

  const { setTrips, loading } = useTripStore();

  const { data: vehicles, isLoading, error } = useVehiclesQuery();

  const onSubmit = async (data: any) => {
    useTripStore.setState({ loading: true });

    if (dateFilterType === "quincena") {
      if (!selectedMonth || !selectedYear) {
        toast.error("Por favor, selecciona un mes y un año.");
        useTripStore.setState({ loading: false });
        return;
      }

      const { end_date, start_date } = calculateFortnightDates(
        selectedYear,
        selectedMonth,
        selectedPeriod
      );

      data.start_date = start_date;
      data.end_date = end_date;

      console.log("no  modificado", start_date);
      console.log("new dates", new Date(start_date).toISOString());
    } else {
      if (!data.start_date && !data.end_date) {
        toast.error("Por favor, selecciona un rango de fechas.");
        useTripStore.setState({ loading: false });
        return;
      }
    }

    try {
      const fetchedTrips = await getTrips(data);
      setTrips(fetchedTrips);
    } catch (error) {
      toast.error("Ocurrió un error al obtener los viajes, intenta de nuevo.");
      console.log(error);
      return;
    } finally {
      useTripStore.setState({ loading: false });
    }
  };

  const handleFiltersReset = () => {
    reset();
    setSelectedMonth("");
    setSelectedYear(CURRENT_YEAR.toString());
    setSelectedPeriod("primera");
    setDateFilterType("quincena");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-12 mb-2 w-1/2" />
          <Skeleton className="h-12 mb-2 w-1/5" />
          <Skeleton className="h-12 mb-2 w-1/5" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-12 mb-2 w-1/3" />
          <Skeleton className="h-12 mb-2 w-1/3" />
          <Skeleton className="h-12 mb-2 w-1/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <p className="text-red-500">Error al cargar los vehículos.</p>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <p className="text-red-500">No hay vehículos disponibles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && <NonInteractiveLoader text="Buscando" />}
      <div>
        <form className="space-y-6 pt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <Controller
                name="vehicle_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle: Vehicle) => (
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

            <div className="space-y-2">
              <RadioGroup
                value={dateFilterType}
                onValueChange={(value) =>
                  setDateFilterType(value as "quincena" | "rango")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quincena" id="quincena" />
                  <Label htmlFor="quincena">Por Quincena</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rango" id="rango" />
                  <Label htmlFor="rango">Rango de Fechas</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {dateFilterType === "quincena" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <TbCalendarMonth className="h-[18px] w-[18px]" />
                  Mes
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar mes" />
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  Año
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar año" />
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <LucideCalendarRange className="h-4 w-4" />
                  Quincena
                </label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod as any}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar quincena" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primera">Primera Quincena</SelectItem>
                    <SelectItem value="segunda">Segunda Quincena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <CiCalendarDate className="h-5 w-5" />
                  Fecha Inicial
                </label>
                <Input
                  type="date"
                  value={watch("start_date")}
                  onChange={(e) => setValue("start_date", e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  <IoCalendarNumberOutline className="h-4 w-4" />
                  Fecha Final
                </label>
                <Input
                  type="date"
                  value={watch("end_date")}
                  onChange={(e) => setValue("end_date", e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              className="flex items-center gap-2"
              disabled={loading}
              variant="outline"
              type="button"
              onClick={() => handleFiltersReset()}
            >
              <RefreshCcw className="h-4 w-4" />
              Limpiar filtros
            </Button>
            <Button
              className="flex items-center gap-2"
              disabled={loading}
              variant="primary"
            >
              <Search className="h-4 w-4" />
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
