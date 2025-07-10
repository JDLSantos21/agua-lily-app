"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  CalendarClock,
  Search,
  Loader2,
  CheckCircle2,
  FileSearch,
} from "lucide-react";

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
import { useAuthStore } from "@/stores/authStore";
import { Label } from "@/components/ui/label";
import PendingTripInfoCard from "./pending-trip-info-card";
import { VehicleTrips } from "../types/trips";
import {
  useCompleteTrip,
  useGetPendingTrip,
  useGetTripDefaults,
} from "@/shared/hooks/useTrips";

export interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

const formSchema = z.object({
  trip_id: z.number().optional(),
  amount: z.string().min(1, { message: "Debe ingresar un monto" }),
  concept: z.string(),
  user_id: z.number().nullable(),
});

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const buttonVariants = {
  idle: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

export default function TripCompleteForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [tripId, setTripId] = useState<string>("");
  const [searchTripId, setSearchTripId] = useState<string>("");
  const user_id = useAuthStore((state) => state.user_id);
  const amountInputRef = useRef<HTMLInputElement>(null);

  const { data: tripDefaults } = useGetTripDefaults();
  const {
    data: trip,
    isLoading: loadingTrip,
    error: tripError,
  } = useGetPendingTrip(searchTripId);

  const completeTrip = useCompleteTrip();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      concept: "Viaje Estándar",
      user_id: user_id,
    },
  });

  const isFormValid = form.watch("amount") && form.watch("concept") && trip;

  useEffect(() => {
    if (tripError) {
      toast.warning(tripError.message || "Error al buscar el viaje");
    }
  }, [tripError]);

  useEffect(() => {
    if (trip && tripDefaults) {
      const tripVehicle = tripDefaults.find(
        (vehicle: VehicleTrips) => vehicle.vehicle_id === trip.vehicle_id
      );

      if (tripVehicle) {
        form.setValue("amount", tripVehicle.amount.toString());
      }
    }
  }, [trip, tripDefaults, form]);

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

    if (!values.amount || !values.concept) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (Number(values.amount) <= 0) {
      toast.error("El monto debe ser mayor a 0.");
      return;
    }

    if (!values.user_id) {
      toast.error("No se ha podido encontrar el usuario");
      return;
    }

    const submitData = {
      ...values,
      trip_id: trip.id,
    };

    completeTrip.mutate(submitData, {
      onSuccess: () => {
        form.reset({
          amount: "",
          concept: "Viaje Estándar",
          user_id: user_id,
        });
        setSearchTripId("");
        setTripId("");
        onSuccess?.();
      },
    });
  };

  const handleGetPendingTrip = () => {
    if (!tripId) {
      toast.error("Debe ingresar el número de viaje.");
      return;
    }

    if (trip && trip.id === parseInt(tripId)) {
      toast.error("Este viaje ya se ha encontrado.");
      return;
    }

    setSearchTripId(tripId);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search Section */}
      <motion.div variants={inputVariants} initial="hidden" animate="visible">
        <Label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileSearch className="w-4 h-4 text-blue-600" />
          </div>
          Número de Conduce
        </Label>
        <div className="flex gap-3">
          <div className="flex-grow">
            <Input
              ref={amountInputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGetPendingTrip();
                }
              }}
              placeholder="Ingrese el NO. de conduce"
              className="h-12 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-blue-300 focus:border-blue-500 transition-all duration-300 focus:ring-4 focus:ring-blue-100 noControls"
              type="number"
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
            />
          </div>
          <motion.div
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={handleGetPendingTrip}
              disabled={loadingTrip}
              className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all duration-300"
            >
              {loadingTrip ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex justify-between">
        {/* Form Section - Horizontal Layout */}
        <AnimatePresence>
          {trip && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl p-6 border border-green-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Detalles del Viaje
                </h3>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Horizontal Form Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                    >
                      <FormField
                        control={form.control}
                        name="concept"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <CalendarClock className="h-4 w-4 text-purple-600" />
                              </div>
                              Tipo de viaje
                            </FormLabel>
                            <Select
                              onValueChange={handleTypeChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-purple-300 focus:border-purple-500 transition-all duration-300 focus:ring-4 focus:ring-purple-100">
                                  <SelectValue placeholder="Selecciona el tipo de viaje" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                                <SelectItem
                                  value="Viaje Estándar"
                                  className="rounded-lg my-1 hover:bg-purple-50 focus:bg-purple-50 transition-colors duration-200"
                                >
                                  Viaje Estándar
                                </SelectItem>
                                <SelectItem
                                  value="Viaje Rapido"
                                  className="rounded-lg my-1 hover:bg-purple-50 focus:bg-purple-50 transition-colors duration-200"
                                >
                                  Viaje Rápido
                                </SelectItem>
                                <SelectItem
                                  value="Comisión por ventas"
                                  className="rounded-lg my-1 hover:bg-purple-50 focus:bg-purple-50 transition-colors duration-200"
                                >
                                  Comisión por ventas
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 text-sm mt-2" />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="h-4 w-4 text-green-600" />
                              </div>
                              Monto
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Ingrese el monto"
                                  {...field}
                                  className="h-12 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-green-300 focus:border-green-500 transition-all duration-300 focus:ring-4 focus:ring-green-100 noControls pl-8"
                                  type="number"
                                />
                                <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm mt-2" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-2"
                  >
                    <motion.div
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="submit"
                        className={`
                        w-full h-12 text-base font-semibold rounded-xl transition-all duration-300
                        ${
                          isFormValid
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }
                      `}
                        disabled={completeTrip.isPending || !isFormValid}
                      >
                        <AnimatePresence mode="wait">
                          {completeTrip.isPending ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-3"
                            >
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Completando viaje...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-3"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                              <span>Completar Viaje</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Trip Info Card */}
        <motion.div
          className={`min-h-[80px] ${trip ? "w-[45%]" : "w-full"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PendingTripInfoCard trip={trip} loading={loadingTrip} />
        </motion.div>
      </div>
    </motion.div>
  );
}
