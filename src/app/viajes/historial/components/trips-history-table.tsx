"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDialogStore } from "@/stores/dialogStore";
import { useTripStore } from "@/stores/tripStore";
import { copyToClipboard } from "@/utils/clipboard";
import { formatToDop } from "@/utils/formatCurrency";
import { format } from "@formkit/tempo";
import { GoCheckCircle } from "react-icons/go";
import { GoClock } from "react-icons/go";

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

export default function TripsHistoryTable({
  data,
  onHandleTrip,
}: {
  data: TripRegister[] | null;
  onHandleTrip: (trip: TripRegister) => void;
}) {
  const { open } = useDialogStore();
  const pendingTrips = data?.filter((trip) => trip.status === "pending") || [];
  const completedTrips =
    data?.filter((trip) => trip.status === "completed") || [];

  return (
    <>
      <Tabs className="w-full" defaultValue="Pendientes">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="Pendientes" className="font-semibold w-1/2">
            <GoClock className="mr-2 w-5 h-5 text-yellow-500" />
            Pendientes
          </TabsTrigger>
          <TabsTrigger value="Completados" className="font-semibold w-1/2">
            <GoCheckCircle className="mr-2 w-5 h-5 text-green-500" />
            Completados
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Pendientes">
          {pendingTrips && pendingTrips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conduce</TableHead>
                  <TableHead>Camión</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTrips.map((trip) => (
                  <TableRow
                    key={trip.id}
                    onClick={() => {
                      onHandleTrip(trip);
                      useTripStore.setState({ selectedTripId: trip.id });
                      open("edit-pending-trip-dialog");
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell
                      onClick={() => copyToClipboard(trip.id.toString())}
                    >
                      #{trip.id}
                    </TableCell>
                    <TableCell>{trip.vehicle_tag}</TableCell>
                    <TableCell>{trip.driver}</TableCell>
                    <TableCell>
                      {format(trip.date, { date: "medium", time: "short" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="h-24 border shadow-md grid place-content-center">
              <span className="text-[--muted-foreground]">
                No hay viajes pendientes en la fecha seleccionada.
              </span>
            </div>
          )}
        </TabsContent>
        <TabsContent value="Completados">
          {completedTrips && completedTrips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conduce</TableHead>
                  <TableHead>Camión</TableHead>
                  <TableHead>Conductor</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedTrips.map((trip) => (
                  <TableRow
                    key={trip.id}
                    onClick={() => onHandleTrip(trip)}
                    className="cursor-pointer"
                  >
                    <TableCell>#{trip.id}</TableCell>
                    <TableCell>{trip.vehicle_tag}</TableCell>
                    <TableCell>{trip.driver}</TableCell>
                    <TableCell>{trip.concept}</TableCell>
                    <TableCell>{formatToDop(trip.amount || 0)}</TableCell>
                    <TableCell>
                      {format(trip.date, { date: "medium", time: "short" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="h-24 border shadow-md grid place-content-center">
              <span className="text-[--muted-foreground]">
                No hay viajes completados en la fecha seleccionada.
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
