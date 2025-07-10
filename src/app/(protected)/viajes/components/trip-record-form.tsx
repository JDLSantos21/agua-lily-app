"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Truck, User, CheckCircle2, AlertCircle } from "lucide-react";
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
import { useAuthStore } from "@/stores/authStore";
import { useGetTripDefaults, useRegisterTrip } from "@/shared/hooks/useTrips";

const formSchema = z.object({
  vehicle_id: z.string().min(1, { message: "Debe seleccionar un vehículo" }),
  employee_id: z.string().min(1, { message: "Debe seleccionar un conductor" }),
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

export default function TripRecordForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const user_id = useAuthStore((state) => state.user_id);

  const { data: tripDefaults, isLoading: loadingDefaults } =
    useGetTripDefaults();
  const registerTrip = useRegisterTrip();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_id: "",
      employee_id: "",
      user_id: user_id,
    },
  });

  const isFormValid = form.watch("vehicle_id") && form.watch("employee_id");

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

  const handleVehicleChange = (vehicleId: string) => {
    if (!tripDefaults) return;

    const selectedVehicle = tripDefaults.find(
      (data: any) => data.vehicle_id.toString() === vehicleId
    );

    if (selectedVehicle) {
      form.setValue("employee_id", selectedVehicle.driver_id.toString());
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.user_id) {
      toast.error("No se ha podido encontrar el usuario");
      return;
    }

    registerTrip.mutate(values, {
      onSuccess: () => {
        form.reset({
          vehicle_id: "",
          employee_id: "",
          user_id: user_id,
        });
        onSuccess?.();
      },
    });
  };

  if (loadingDefaults) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-3"
          >
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!tripDefaults || tripDefaults.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">
          No hay datos de vehículos disponibles
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          key="vehicle-field"
          variants={inputVariants}
          initial="hidden"
          animate="visible"
        >
          <FormField
            control={form.control}
            name="vehicle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Truck className="h-4 w-4 text-green-600" />
                  </div>
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
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-green-300 focus:border-green-500 transition-all duration-300 focus:ring-4 focus:ring-green-100">
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                    {tripDefaults.map((data: any, index: number) => {
                      // Create a unique key by combining multiple properties
                      const uniqueKey = `vehicle-${data.vehicle_id}-${data.vehicle_tag}-${index}`;
                      return (
                        <SelectItem
                          key={uniqueKey}
                          value={data.vehicle_id.toString()}
                          className="rounded-lg my-1 hover:bg-green-50 focus:bg-green-50 transition-colors duration-200"
                        >
                          <span className="font-medium">
                            {data.vehicle_tag}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm mt-2" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          key="employee-field"
          variants={inputVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="employee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  Conductor
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-blue-300 focus:border-blue-500 transition-all duration-300 focus:ring-4 focus:ring-blue-100">
                      <SelectValue placeholder="Seleccionar conductor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                    {tripDefaults.map((data: any, index: number) => {
                      // Create a unique key by combining multiple properties
                      const uniqueKey = `driver-${data.driver_id}-${data.driver}-${index}`;
                      return (
                        <SelectItem
                          key={uniqueKey}
                          value={data.driver_id.toString()}
                          className="rounded-lg my-1 hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-200"
                        >
                          <span className="font-medium">{data.driver}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm mt-2" />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
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
                w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300
                ${
                  isFormValid
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
              disabled={registerTrip.isPending || !isFormValid}
            >
              <AnimatePresence mode="wait">
                {registerTrip.isPending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registrando viaje...</span>
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
                    <span>Registrar Viaje</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Keyboard shortcut hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-gray-500 text-center mt-3"
          >
            Presiona{" "}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
              Ctrl + Enter
            </kbd>{" "}
            para enviar
          </motion.p>
        </motion.div>
      </motion.form>
    </Form>
  );
}
