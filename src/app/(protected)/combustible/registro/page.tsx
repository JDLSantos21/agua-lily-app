"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { fetchRegisterInitialData, registerFuelConsumption } from "@/api/fuel";
import { useAuthStore } from "@/stores/authStore";
import FuelRecordDisplay from "./components/fuel-record-display";
import FuelRegisterSkeleton from "./components/fuel-register-skeleton";
import { InitialData, LastRecord } from "@/types/fuel.types";

// Esquema de validación con Zod
const fuelSchema = z.object({
  vehicle_id: z.string().min(1, "Selecciona un vehículo"),
  driver: z.string().min(1, "Selecciona un conductor"),
  mileage: z.number().min(1, "El kilometraje no puede ser 0 ni negativo"),
  gallons: z
    .number()
    .min(1, "Los galones no pueden ser 0 ni negativos")
    .max(300, "Los galones no pueden ser mayores a 200"),
  record_date: z.string().optional().nullable(),
  signature: z.number().optional().nullable(),
});

type FormData = z.infer<typeof fuelSchema>;

export default function FuelRegisterForm() {
  const [initialData, setInitialData] = useState<InitialData | null>(null);
  const [showDateInput, setShowDateInput] = useState(false);
  const [lastRecord, setLastRecord] = useState<LastRecord | undefined>(
    undefined
  );
  const user_id = useAuthStore((state) => state.user_id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      vehicle_id: "",
      driver: "",
      mileage: 0,
      gallons: 0,
    },
  });

  // Watch vehicle ID for changes
  const watchVehicleId = watch("vehicle_id");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRegisterInitialData();
        setInitialData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Update lastRecord when vehicle changes or initialData loads
  useEffect(() => {
    if (initialData && watchVehicleId) {
      const record = initialData.lastRecords.find(
        (record) => Number(record.vehicle_id) === Number(watchVehicleId)
      );
      setLastRecord(record);
    } else {
      setLastRecord(undefined);
    }
  }, [watchVehicleId, initialData]);

  // Muestra los errores del formulario en un useEffect en lugar de durante el renderizado
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((key) => {
        const errorMessage = errors[key as keyof FormData]?.message;
        if (errorMessage && typeof errorMessage === "string") {
          toast.error(errorMessage);
        }
      });
    }
  }, [errors]);

  // Si initialData es null, renderiza el skeleton
  if (!initialData) {
    return <FuelRegisterSkeleton />;
  }

  const onSubmit = async (data: FormData) => {
    // Validaciones adicionales
    let hasValidationErrors = false;

    if (data.vehicle_id != String(30)) {
      if (lastRecord === undefined) {
        toast.error("No se encontró el último registro del vehículo");
        hasValidationErrors = true;
      } else if (lastRecord?.mileage >= data.mileage) {
        toast.error("El kilometraje no puede ser menor al último registro");
        hasValidationErrors = true;
      } else if (data.mileage - lastRecord?.mileage > 500) {
        toast.error("La diferencia de kilometraje no puede ser mayor a 500 km");
        hasValidationErrors = true;
      }

      if (data.gallons > 50) {
        toast.error("La cantidad de galones no puede ser mayor a 50");
        hasValidationErrors = true;
      }
    }

    if (!user_id) {
      toast.error("No se pudo obtener el ID del usuario");
      hasValidationErrors = true;
    }

    if (data.record_date) {
      data.record_date = new Date(data.record_date).toString();
    }

    console.log(data.record_date);

    // Si hay errores de validación, no continúes
    if (hasValidationErrors) {
      return;
    }

    data.signature = user_id;

    const requestPromise = registerFuelConsumption(data);

    // Desencadena el toast "promise"
    toast.promise(requestPromise, {
      loading: "Registrando consumo de combustible...",
      success: () => {
        reset();
        return "Consumo registrado correctamente";
      },
      error: (err) => `Error al registrar: ${err.message}`,
    });

    // Espera la finalización de tu promesa real
    try {
      await requestPromise;
      // Solo se resetea si salió bien
      // reset({ vehicle_id: "", driver: "", mileage: 0, gallons: 0 });
      // setShowDateInput(false);
    } catch {
      // Error ya fue manejado por toast.promise
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Registrar Consumo
              </h2>
              <p className="text-sm text-gray-500">
                Registra el consumo de combustible del vehículo
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label
                  htmlFor="vehicle_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Vehículo
                </Label>
                <Controller
                  name="vehicle_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Selecciona un vehículo" />
                      </SelectTrigger>
                      <SelectContent>
                        {initialData.vehicles.map((vehicle) => (
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

              <div>
                <Label
                  htmlFor="driver"
                  className="text-sm font-medium text-gray-700"
                >
                  Conductor
                </Label>
                <Controller
                  name="driver"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Selecciona un conductor" />
                      </SelectTrigger>
                      <SelectContent>
                        {initialData.drivers.map((driver) => (
                          <SelectItem
                            key={driver.id}
                            value={`${driver.name} ${driver.last_name}`}
                          >
                            {`${driver.name} ${driver.last_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="mileage"
                    className="text-sm font-medium text-gray-700"
                  >
                    Kilometraje
                  </Label>
                  <Input
                    id="mileage"
                    type="number"
                    step="0.01"
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 noControls"
                    placeholder="0"
                    {...register("mileage", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="gallons"
                    className="text-sm font-medium text-gray-700"
                  >
                    Galones
                  </Label>
                  <Input
                    id="gallons"
                    type="number"
                    step="0.01"
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 noControls"
                    placeholder="0.00"
                    {...register("gallons", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="different-date"
                  checked={showDateInput}
                  onCheckedChange={(checked) => setShowDateInput(!!checked)}
                />
                <Label
                  htmlFor="different-date"
                  className="text-sm text-gray-700"
                >
                  Fecha diferente a la actual
                </Label>
              </div>

              {showDateInput && (
                <div>
                  <Label
                    htmlFor="record_date"
                    className="text-sm font-medium text-gray-700"
                  >
                    Fecha y Hora
                  </Label>
                  <Input
                    id="record_date"
                    type="datetime-local"
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    {...register("record_date")}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registrando..." : "Registrar Consumo"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Último Registro */}
        <FuelRecordDisplay lastRecord={lastRecord} />
      </div>
    </div>
  );
}
