"use client";
import { format } from "@formkit/tempo";
import { motion } from "framer-motion";
import { GiSteeringWheel } from "react-icons/gi";
import { LuCalendarClock } from "react-icons/lu";
import { HiUser } from "react-icons/hi2";
import { Info } from "lucide-react";
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="h-36 p-4 border flex flex-col items-center justify-center gap-3 border-gray-100 rounded-sm shadow-sm my-5"
      >
        <Info className="text-blue-500/80" />
        <span className="text-sm text-center text-gray-400">
          Introduce el número de viaje para ver la información del viaje
          pendiente.
        </span>
      </motion.div>
    );
  }

  return (
    <>
      {trip && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-3 border border-gray-200 rounded-sm shadow my-5"
        >
          <div className="text-lg font-extrabold flex justify-between items-center mb-2">
            <span>{trip.vehicle_tag}</span>
            <span className="text-red-500"># {trip.id}</span>
          </div>
          <div className="flex items-center mb-2">
            <GiSteeringWheel className="w-4 h-4 mr-2" />
            <span className="uppercase">{trip.driver}</span>
          </div>
          <div className="flex items-center mb-2">
            <LuCalendarClock className="w-4 h-4 mr-2" />
            <span className="uppercase">
              {format(trip.date, { date: "full", time: "short" })}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <HiUser className="w-4 h-4 mr-2" />
            <span className="uppercase">{trip.user}</span>
          </div>
        </motion.div>
      )}
    </>
  );
}
