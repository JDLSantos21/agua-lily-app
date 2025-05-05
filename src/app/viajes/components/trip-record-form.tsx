"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { registerTrip } from "@/api/trips";
import { useAuthStore } from "@/stores/authStore";
// import { CreateOutTripPDF } from "./out-trip-pdf";
import { useTripStore } from "@/stores/tripStore";
import { createOutTripInvoice } from "../utils/CreateInvoices";

const formSchema = z.object({
  vehicle_id: z.string().min(1, { message: "Debe seleccionar un vehículo" }),
  employee_id: z.string().min(1, { message: "Debe seleccionar un conductor" }),
  user_id: z.number().nullable(),
});

export default function TripRecordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user_id = useAuthStore((state) => state.user_id);
  const { registerTripDefaults } = useTripStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_id: "",
      employee_id: "",
      user_id: user_id,
    },
  });

  // usar el atajo de teclado Ctrl + Enter para enviar el formulario
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form]);

  // Cuando se selecciona un vehículo, actualizar conductor y monto automáticamente
  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = registerTripDefaults.find(
      (data) => data.vehicle_id.toString() === vehicleId
    );

    if (selectedVehicle) {
      form.setValue("employee_id", selectedVehicle.driver_id.toString());
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      if (!values.user_id) {
        toast.error("No se ha podido encontrar el usuario");
        return;
      }

      const response = await registerTrip(values);

      toast.success(`Nuevo viaje registrado satifasctoriamente`, {
        description: `Al camión ${response.trip.vehicle_tag}`,
      });

      console.log(response.trip);

      // await createTripPDF(response.trip);
      // await CreateOutTripPDF(response.trip);

      const printResult = await createOutTripInvoice(response.trip);

      if (!printResult.success) {
        let errorDescription =
          printResult.message ||
          "Ocurrión un error inesperado, intente de nuevo.";
        if (errorDescription.includes("Failed to fetch")) {
          errorDescription = "No se encontro el plugin o no esta iniciado";
        }

        toast.warning(
          "El viaje se registró pero hubo un problema al imprimir el conduce",
          {
            description: errorDescription,
          }
        );
      }

      form.reset({
        vehicle_id: "",
        employee_id: "",
        user_id: user_id,
      });
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error al registrar el viaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-1/2 pr-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="vehicle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehículo
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleVehicleChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {registerTripDefaults.map((data) => (
                      <SelectItem
                        key={data.vehicle_id}
                        value={data.vehicle_id.toString()}
                      >
                        {data.vehicle_tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Conductor
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleccionar conductor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {registerTripDefaults.map((data) => (
                      <SelectItem
                        key={data.driver_id}
                        value={data.driver_id.toString()}
                      >
                        {data.driver}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="px-0 pt-2 flex flex-col">
            <Button
              type="submit"
              variant="primary"
              className="self-end w-44"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando
                </span>
              ) : (
                <span>Registrar viaje</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
