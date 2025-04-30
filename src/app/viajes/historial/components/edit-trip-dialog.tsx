"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "@formkit/tempo";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TripRegister } from "./trips-history-table";
// Form validation schema
const tripFormSchema = z.object({
  vehicle_tag: z.string().min(1, "El tag del vehículo es requerido"),
  concept: z.string().min(1, "El concepto es requerido"),
  amount: z.coerce.number().min(0, "El monto debe ser mayor o igual a 0"),
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  hour: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    ),
  driver: z.string().min(1, "El nombre del conductor es requerido"),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

interface EditTripDialogProps {
  trip: TripRegister | null;
  onSave: (trip: TripRegister) => void;
  setTrip: (trip: TripRegister | null) => void;
}

export function EditTripDialog({ trip, onSave, setTrip }: EditTripDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with trip data or default values
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: trip
      ? {
          ...trip,
          date: new Date(trip.date),
          amount: Number(trip.amount),
        }
      : {
          vehicle_tag: "test",
          concept: "",
          amount: 800,
          date: new Date(),
          hour: "",
          driver: "",
        },
  });

  // Update form values when trip changes
  useState(() => {
    if (trip) {
      form.reset({
        vehicle_tag: trip.vehicle_tag,
        concept: trip.concept,
        amount: Number(trip.amount),
        date: new Date(trip.date),
        hour: trip.hour,
        driver: trip.driver,
      });
    }
  });

  async function onSubmit(data: TripFormValues) {
    if (!trip) return;

    setIsSubmitting(true);
    try {
      // Here you would implement the actual API call to update the trip
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Combine the original trip data with the updated form data
      const updatedTrip: TripRegister = {
        ...trip,
        vehicle_tag: data.vehicle_tag,
        concept: data.concept,
        amount: data.amount,
        date: format(data.date, "YYYY-MM-DD"),
        hour: data.hour,
        driver: data.driver,
      };

      onSave(updatedTrip);
    } catch (error) {
      toast.error("Error al actualizar el viaje");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={!!trip} onOpenChange={(open) => setTrip(open ? trip : null)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar viaje</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del viaje #{trip?.id}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle_tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag del vehículo</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conductor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del conductor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Concepto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del viaje"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, { date: "medium" })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="HH:MM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTrip(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTripDialog;
