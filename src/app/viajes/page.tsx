"use client";

import { useEffect } from "react";
import TripCompleteForm from "./components/trip-complete-form";
import TripRecordForm from "./components/trip-record-form";
import { useTripStore } from "@/stores/tripStore";
import { Skeleton } from "@/components/ui/skeleton";
import LabelGenerator from "./components/label-generator";

function TripPageSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-12 mb-2 w-full" />
      <Skeleton className="h-12 mb-2 w-full opacity-75" />
      <Skeleton className="h-12 mb-2 w-full opacity-50" />
      <Skeleton className="h-12 mb-2 w-full opacity-25" />
      <Skeleton className="h-12 mb-2 w-full opacity-10" />
    </div>
  );
}

export default function Viaje() {
  const { getRegisterTripDefaults, loading, registerTripDefaults } =
    useTripStore();

  useEffect(() => {
    getRegisterTripDefaults();
  }, []);

  return (
    <div className="flex flex-col space-y-6 w-full max-w-full overflow-x-hidden">
      {loading || !registerTripDefaults ? (
        <TripPageSkeleton />
      ) : (
        <>
          {/* Contenedor para los dos primeros formularios en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta 1: Registrar viaje */}
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                Registrar Viaje
              </h2>
              <TripRecordForm />
            </div>

            {/* Tarjeta 2: Completar viaje */}
            <div className="p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                Completar Viaje
              </h2>
              <TripCompleteForm />
            </div>
          </div>

          <LabelGenerator />
        </>
      )}
    </div>
  );
}
