"use client";
import { format } from "@formkit/tempo";
import { motion } from "framer-motion";
import { GiSteeringWheel } from "react-icons/gi";
import { HiUser } from "react-icons/hi2";
import { Info, Truck, Clock } from "lucide-react";
import TripInfoCardSkeleton from "./trip-info-card-skeleton";

export interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

interface Props {
  trip?: PendingTrip | null;
  loading?: boolean;
}

export default function PendingTripInfoCard({ trip, loading = false }: Props) {
  if (loading) {
    return <TripInfoCardSkeleton />;
  }

  if (!trip && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-2xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center shadow-lg w-full">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="p-3 bg-blue-100 rounded-full mb-3"
          >
            <Info className="text-blue-600 h-6 w-6" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-700 font-medium text-sm"
          >
            Buscar Viaje Pendiente
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-600/70 text-xs mt-1"
          >
            Introduce el número de conduce para ver la información del viaje
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {trip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative group"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 to-emerald-100/60 rounded-2xl"></div>

          {/* Main card */}
          <div className="relative bg-white/90 backdrop-blur-sm border border-green-200/50 rounded-2xl p-5 shadow-lg group-hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {trip.vehicle_tag}
                  </h3>
                  <p className="text-green-600 text-sm font-medium">
                    Viaje Encontrado
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  # {trip.id}
                </span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GiSteeringWheel className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-medium uppercase">
                    Conductor
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {trip.driver}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <HiUser className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-purple-600 font-medium uppercase">
                    Usuario
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {trip.user}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-xl"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-orange-600 font-medium uppercase">
                    Fecha y Hora
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {format(trip.date, { date: "short", time: "short" })}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
