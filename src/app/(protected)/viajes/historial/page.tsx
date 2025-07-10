"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { CalendarIcon, Search, Loader2 } from "lucide-react";
import { format } from "@formkit/tempo";

import { Skeleton } from "@/components/ui/skeleton";
import TripsHistoryTable from "./components/trips-history-table";
import { useTripsHistory } from "@/shared/hooks/useTrips";
import EditPendingTripDialog from "../components/edit-pending-trip-dialog";

export interface TripRegister {
  id: number;
  vehicle_tag: string;
  concept: string | null;
  amount: number | null;
  date: string;
  payment_date: string | null;
  driver: string;
  user: string;
  status: string;
}

const TableSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
};

export default function TripHistory() {
  const router = useRouter();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      date: format(new Date(), "YYYY-MM-DD"),
    },
  });

  const selectedDate = watch("date");
  const { data: trips, isLoading } = useTripsHistory(selectedDate);

  const handleBack = () => {
    router.back();
  };

  async function onSubmit(formData: any) {
    // El hook se actualiza automáticamente cuando cambia la fecha
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200/60 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
                onClick={handleBack}
              >
                <MdOutlineKeyboardBackspace className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Historial de Viajes
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Visualiza y gestiona los viajes por fecha
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200"
            >
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <Input
                type="date"
                {...register("date")}
                className="border-0 bg-transparent p-0 h-auto font-medium text-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : (
            <TripsHistoryTable data={trips || []} onHandleTrip={() => {}} />
          )}
        </div>

        {/* Dialogs */}
        <EditPendingTripDialog />
      </div>
    </div>
  );
}
