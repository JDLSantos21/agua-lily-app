"use client";
import { useDialogStore } from "@/stores/dialogStore";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoaderSpin } from "@/components/Loader";
import { useTripStore } from "@/stores/tripStore";
import { motion } from "framer-motion";
import { memo, useEffect } from "react";
import { useGetPendingTrip } from "@/shared/hooks/useTrips";
import { useVehiclesQuery } from "@/hooks/useVehiclesQuery";
import { useEmployeesQuery } from "@/hooks/useEmployees";

interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

export default memo(function EditPendingTripDialog() {
  const { selectedTripId } = useTripStore();
  const { openDialog, close } = useDialogStore();

  const { data: trip, isLoading: tripLoading } = useGetPendingTrip(
    selectedTripId ? selectedTripId.toString() : ""
  );

  const { data: vehicles = [], isLoading: vehiclesLoading } =
    useVehiclesQuery();
  const { data: employees = [], isLoading: employeesLoading } =
    useEmployeesQuery("conductor");

  const { control, handleSubmit, setValue } = useForm<PendingTrip>({
    defaultValues: {
      vehicle_tag: "",
      driver: "",
      user: "",
    },
  });

  // Reset form when trip data changes
  useEffect(() => {
    if (trip) {
      setValue("vehicle_tag", trip.vehicle_tag || "");
      setValue("driver", trip.driver || "");
      setValue("user", trip.user || "");
    }
  }, [trip, setValue]);

  const onSubmit = (data: PendingTrip) => {
    console.log("Form data:", data);
    // TODO: Implement update trip logic
  };

  const isLoading = tripLoading || vehiclesLoading || employeesLoading;

  return (
    <Dialog
      open={openDialog === "edit-pending-trip-dialog"}
      onOpenChange={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Editar Viaje Pendiente
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Modifica los detalles del viaje #{selectedTripId}
            </p>
          </DialogHeader>

          {isLoading ? (
            <div className="py-8">
              <LoaderSpin
                text="Cargando datos del viaje..."
                className="mx-auto"
              />
            </div>
          ) : !trip && !tripLoading ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Viaje no encontrado
              </h3>
              <p className="text-gray-500 text-sm">
                No se pudo encontrar el viaje pendiente.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="vehicle_tag"
                    className="text-sm font-medium text-gray-700"
                  >
                    Camión (Ficha)
                  </Label>
                  <Controller
                    name="vehicle_tag"
                    control={control}
                    rules={{ required: "Selecciona un camión" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecciona un camión" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem
                              key={vehicle.id}
                              value={vehicle.current_tag}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {vehicle.current_tag}
                                </span>
                                <span className="text-sm text-gray-500">
                                  - {vehicle.brand} {vehicle.model}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="driver"
                    className="text-sm font-medium text-gray-700"
                  >
                    Conductor
                  </Label>
                  <Controller
                    name="driver"
                    control={control}
                    rules={{ required: "Selecciona un conductor" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecciona un conductor" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={`${employee.name} ${employee.last_name}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {employee.name} {employee.last_name}
                                </span>
                                {employee.code && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    {employee.code}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={close}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </motion.div>
    </Dialog>
  );
});
