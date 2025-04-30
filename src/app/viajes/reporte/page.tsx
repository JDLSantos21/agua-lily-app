"use client";

import TripsFilter from "../components/trips-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripStore } from "@/stores/tripStore";
import TripReportTable from "../components/trip-report-table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileSearch, Info } from "lucide-react";

// type DailySummary = {
//   day: number;
//   conduces: string;
//   concept: "Viaje Estándar" | "Viaje Rápido";
//   count: number;
//   price_per_trip: number;
//   total: number;
//   vehicle_tag: string;
//   driver: string;
// };

export default function ReporteViajes() {
  const { trips, loading, resetTrips } = useTripStore();

  return (
    <div>
      <div className={`${trips ? "hidden" : "block"}`}>
        <TripsFilter />
      </div>
      {loading ? (
        <div className="space-y-2 mt-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : trips ? (
        <div className="pb-20">
          <Button
            variant="outline"
            className="mb-5"
            onClick={() => resetTrips()}
          >
            <FileSearch className="h-4 w-4" />
            Realizar otra búsqueda
          </Button>
          <TripReportTable data={trips} singleVehicleMode />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-muted-foreground select-none text-lg border p-2 w-96 mx-auto"
        >
          <div className="flex items-center justify-center text-blue-400 space-x-2 text-sm">
            <Info className="h-6 w-6" />
            <p>Información</p>
          </div>
          <div className="text-center text-sm py-2 text-gray-600">
            Realiza una búsqueda para obtener resultados de los viajes.
          </div>
        </motion.div>
      )}
    </div>
  );
}
