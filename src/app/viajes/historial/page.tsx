"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { CalendarIcon, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getTripsHistory } from "@/api/trips";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import TripsHistoryTable from "./components/trips-history-table";
import { format } from "@formkit/tempo";

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
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-4 mb-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full opacity-80" />
      <Skeleton className="h-12 w-full opacity-70" />
      <Skeleton className="h-12 w-full opacity-60" />
      <Skeleton className="h-12 w-full opacity-50" />
      <Skeleton className="h-12 w-full opacity-40" />
    </div>
  );
};

export default function TripHistory() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripRegister[] | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      date: format(new Date(), "YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    onSubmit({ date: format(new Date(), "YYYY-MM-DD") });
  }, []);

  const handleBack = () => {
    router.back();
  };

  async function onSubmit(formData: any) {
    setLoading(true);
    try {
      const data: TripRegister[] = await getTripsHistory(formData);
      setTrips(data);
    } catch (error) {
      toast.error("Ocurrió un error, intente más tarde.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-full"
            onClick={() => handleBack()}
          >
            <MdOutlineKeyboardBackspace className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">
            Historial de Viajes
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 bg-gray-50 pl-3 pr-1 py-1 rounded-md border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <Input
              id="start_date"
              type="date"
              {...register("date")}
              className="border-0 bg-transparent p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            variant="default"
            size="sm"
            className="h-8"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-md">
          {trips && (
            <TripsHistoryTable data={trips} onHandleTrip={() => console.log} />
          )}
        </div>
      )}
    </div>
  );
}
