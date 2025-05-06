"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "@formkit/tempo";
import {
  CalendarIcon,
  Loader2,
  DollarSign,
  Truck,
  UserCircle,
  FileText,
  Clock,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
          vehicle_tag: trip.vehicle_tag,
          concept: trip.concept || "",
          amount: Number(trip.amount || 0),
          date: new Date(trip.date),
          driver: trip.driver,
        }
      : {
          vehicle_tag: "",
          driver: "",
        },
  });

  // Update form values when trip changes
  useEffect(() => {
    if (trip) {
      form.reset({
        vehicle_tag: trip.vehicle_tag,
        concept: trip.concept || "",
        amount: Number(trip.amount || 0),
        date: new Date(trip.date),
        driver: trip.driver,
      });
    }
  }, [trip, form]);

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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="bg-gray-50 p-6 border-b">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200"
            >
              #{trip?.id}
            </Badge>
            <DialogTitle>Editar viaje</DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Actualiza los detalles del viaje
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 pt-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicle_tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Truck className="h-3.5 w-3.5 text-gray-500" />
                      Tag del vehículo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ABC123"
                        {...field}
                        className="h-9 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <UserCircle className="h-3.5 w-3.5 text-gray-500" />
                      Conductor
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del conductor"
                        {...field}
                        className="h-9 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="concept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                    <FileText className="h-3.5 w-3.5 text-gray-500" />
                    Concepto
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del viaje"
                      className="resize-none text-sm min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                    <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                    Monto
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        RD$
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-9 h-9 text-sm"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
                      Fecha
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-9 pl-3 text-left font-normal text-sm",
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Clock className="h-3.5 w-3.5 text-gray-500" />
                      Hora
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="HH:MM"
                        {...field}
                        className="h-9 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTrip(null)}
                className="h-9 text-sm"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
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
