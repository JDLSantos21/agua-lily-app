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
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="p-2 border flex flex-col items-center justify-center gap-1 border-gray-100 rounded-md shadow-sm text-center h-full"
      >
        <Info className="text-blue-500/80 h-4 w-4" />
        <span className="text-xs text-gray-400">
          Introduce el número de viaje para ver la información.
        </span>
      </motion.div>
    );
  }

  return (
    <>
      {trip && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="p-2 border border-gray-200 rounded-md shadow-sm bg-blue-50/50"
        >
          <div className="text-sm font-bold flex justify-between items-center">
            <span>{trip.vehicle_tag}</span>
            <span className="text-red-500"># {trip.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 mt-1 text-xs">
            <div className="flex items-center">
              <GiSteeringWheel className="w-3 h-3 mr-1 text-gray-500 flex-shrink-0" />
              <span className="uppercase truncate">{trip.driver}</span>
            </div>
            <div className="flex items-center">
              <HiUser className="w-3 h-3 mr-1 text-gray-500 flex-shrink-0" />
              <span className="uppercase truncate">{trip.user}</span>
            </div>
            <div className="flex items-center col-span-2">
              <LuCalendarClock className="w-3 h-3 mr-1 text-gray-500 flex-shrink-0" />
              <span className="uppercase truncate text-xs">
                {format(trip.date, { date: "short", time: "short" })}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
