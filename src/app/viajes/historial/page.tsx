"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import { getTripsHistory } from "@/api/trips";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import TripsHistoryTable from "./components/trips-history-table";
import { format } from "@formkit/tempo";
// import EditTripDialog from "./components/edit-trip-dialog";

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
    <div className="flex flex-col gap-3 w-full">
      <Skeleton className="h-12 w-full mb-1" />
      <Skeleton className="h-12 w-full opacity-75" />
      <Skeleton className="h-12 w-full opacity-75" />
      <Skeleton className="h-12 w-full opacity-60" />
      <Skeleton className="h-12 w-full opacity-45" />
      <Skeleton className="h-12 w-full opacity-30" />
      <Skeleton className="h-12 w-full opacity-15" />
    </div>
  );
};

export default function TripHistory() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripRegister[] | null>(null);
  const [loading, setLoading] = useState(false);
  // const [selectedTrip, setSelectedTrip] = useState<TripRegister | null>(null);

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

  // const handleTrip = (trip: TripRegister) => {
  //   setSelectedTrip(trip);
  // };

  async function onSubmit(formData: any) {
    setLoading(true);
    try {
      const data: TripRegister[] = await getTripsHistory(formData);
      setTrips(data);
    } catch (error) {
      toast.error("Ocurrió un error, intente más tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full flex items-center justify-between mb-5">
        <Button
          variant="outline"
          className="self-start"
          onClick={() => handleBack()}
        >
          <MdOutlineKeyboardBackspace />
        </Button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <div className="flex-1">
            <Label htmlFor="start_date">Fecha</Label>
            <Input id="start_date" type="date" {...register("date")} />
          </div>
          <Button variant="primary" className="self-end">
            Buscar
          </Button>
        </form>
      </div>

      {loading && <TableSkeleton />}

      {!loading && trips && (
        <TripsHistoryTable data={trips} onHandleTrip={() => console.log} />
      )}

      {/* Edit Trip Dialog */}
      {/* <EditTripDialog
        trip={selectedTrip}
        setTrip={setSelectedTrip}
        onSave={(updatedTrip: TripRegister) => {
          toast.success("Viaje actualizado correctamente");
          setSelectedTrip(null);
          onSubmit({ date: format(new Date(updatedTrip.date), "YYYY-MM-DD") });
        }}
      /> */}
    </>
  );
}
