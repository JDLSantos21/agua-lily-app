"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DollarSign, CalendarClock, Loader, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { completeTrip, getPendingTripById } from "@/api/trips";
import { useAuthStore } from "@/stores/authStore";
// import { createTripPDF } from "./register-trip-pdf";
import { Label } from "@/components/ui/label";
import { TbFileSearch } from "react-icons/tb";
import PendingTripInfoCard from "./pending-trip-info-card";
import { useTripStore } from "@/stores/tripStore";
import { createCompletedTripInvoice } from "../utils/CreateInvoices";

export interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

const formSchema = z.object({
  trip_id: z
    .number()
    .min(1, { message: "Debe ingresar un número de viaje" })
    .optional(),
  amount: z.string().min(1, { message: "Debe ingresar un monto" }),
  concept: z.string(),
  user_id: z.number().nullable(),
});

export default function TripCompleteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripId, setTripId] = useState<string>("");
  const [trip, setTrip] = useState<PendingTrip | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(false);
  const user_id = useAuthStore((state) => state.user_id);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const { registerTripDefaults } = useTripStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      concept: "Viaje Estándar",
      user_id: user_id,
    },
  });

  const handleTypeChange = (type: string) => {
    form.setValue("concept", type);
    if (type === "Comisión por ventas") {
      form.setValue("amount", "0");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!trip) {
      toast.error("No se ha podido encontrar el viaje.");
      return;
    }

    const { amount, concept, user_id } = values;

    if (!amount || !concept) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (Number(amount) <= 0) {
      toast.error("El monto debe ser mayor a 0.");
      return;
    }

    values.trip_id = trip?.id;
    setIsSubmitting(true);

    try {
      if (!user_id) {
        toast.error("No se ha podido encontrar el usuario");
        return;
      }

      const response = await completeTrip(values);

      toast.success(`${values.concept} Registrado Satisfactoriamente`, {
        description: `Al camión ${response.trip.vehicle_tag} por un monto de RD$ ${values.amount}`,
      });

      // await createTripPDF(response.trip);
      await createCompletedTripInvoice(response.trip);

      form.reset({
        amount: "",
        concept: "Viaje Estándar",
        user_id: user_id,
      });

      setTrip(null);
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error al registrar el viaje.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetPendingTrip = async (tripId: string) => {
    if (!tripId) {
      toast.error("Debe ingresar el número de viaje.");
      return;
    }

    if (trip) {
      if (trip.id === parseInt(tripId)) {
        toast.error("Este viaje ya se ha encontrado.");
        return;
      }
    }

    setLoadingTrip(true);

    try {
      setTrip(null);
      const fetchedTrip = await getPendingTripById(tripId);
      if (fetchedTrip) {
        setTrip(fetchedTrip);
        console.log("Trip Found: ", fetchedTrip);
        const tripVehicle = registerTripDefaults.find(
          (vehicle) => vehicle.vehicle_id == fetchedTrip.vehicle_id
        );

        if (tripVehicle) {
          form.setValue("amount", tripVehicle.amount.toString());
        }
      } else {
        toast.error("No se pudo cargar la información del conduce");
      }
    } catch (error: any) {
      toast.warning(error.message);
    } finally {
      setLoadingTrip(false);
    }
  };

  return (
    <div className="w-1/2 pl-10">
      <div className="w-full flex">
        <Label className="w-3/4 mr-3">
          <span className="flex items-center gap-1 mb-1">
            <TbFileSearch className="w-4 h-4" /> Conduce
          </span>
          <Input
            ref={amountInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGetPendingTrip(tripId);
              }
            }}
            placeholder="Ingrese el NO. de conduce"
            className="h-12 noControls"
            type="number"
            onChange={(e) => setTripId(e.target.value)}
          />
        </Label>
        <div className="self-end">
          <Button
            variant="secondary"
            className="h-12 text-lg"
            disabled={loadingTrip}
            onClick={() => handleGetPendingTrip(tripId)}
          >
            {loadingTrip ? <Loader className="animate-spin" /> : <Search />}
          </Button>
        </div>
      </div>

      <PendingTripInfoCard trip={trip} loading={loadingTrip} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {trip && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="concept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      Tipo de viaje
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        console.log(value);
                        field.onChange;
                        handleTypeChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecciona el tipo de viaje" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Viaje Estándar">
                          Viaje Estándar
                        </SelectItem>
                        <SelectItem value="Viaje Rapido">
                          Viaje Rapido
                        </SelectItem>
                        <SelectItem value="Comisión por ventas">
                          Comisión por ventas
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monto
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el monto"
                        {...field}
                        className="h-12 noControls"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="px-0 pt-2 flex flex-col">
                <Button
                  type="submit"
                  variant="primary"
                  className="self-end"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Completar Viaje"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
