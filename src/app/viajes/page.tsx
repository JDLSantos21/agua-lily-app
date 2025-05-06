"use client";

import { useEffect } from "react";
import TripCompleteForm from "./components/trip-complete-form";
import TripRecordForm from "./components/trip-record-form";
import { useTripStore } from "@/stores/tripStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { labelService } from "@/services/labelService";
import LabelsGenerateSection from "./components/labels-generate-section";
import LabelGenerator from "./components/label-generator";

function TripPageSkeleton() {
  return (
    <div className="w-1/2 pl-10">
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
    <div className="flex">
      {loading || !registerTripDefaults ? (
        <>
          <TripPageSkeleton />
          <TripPageSkeleton />
        </>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex w-full">
            <TripRecordForm />
            <TripCompleteForm />
          </div>
          <div className="pt-20">
            {/* <LabelsGenerateSection /> */}
            <LabelGenerator />
          </div>
        </div>
      )}
    </div>
  );
}
