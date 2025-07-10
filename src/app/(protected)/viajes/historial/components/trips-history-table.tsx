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
import { GoCheckCircle, GoClock } from "react-icons/go";
import { FiEdit, FiCopy } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

  const handleCopyId = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    copyToClipboard(id.toString());
  };

  const handleEditTrip = (e: React.MouseEvent, trip: TripRegister) => {
    e.stopPropagation();
    onHandleTrip(trip);
    useTripStore.setState({ selectedTripId: trip.id });
    open("edit-pending-trip-dialog");
  };

  const EmptyState = ({ type }: { type: "pending" | "completed" }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 px-6 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        {type === "pending" ? (
          <GoClock className="w-8 h-8 text-gray-400" />
        ) : (
          <GoCheckCircle className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {type === "pending"
          ? "Sin viajes pendientes"
          : "Sin viajes completados"}
      </h3>
      <p className="text-gray-500 text-sm">
        No hay {type === "pending" ? "viajes pendientes" : "viajes completados"}{" "}
        en la fecha seleccionada.
      </p>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <div className="p-6">
        <Tabs className="w-full" defaultValue="Pendientes">
          <TabsList className="mb-6 w-full grid grid-cols-2 h-11 p-1 bg-gray-100/80 rounded-lg">
            <TabsTrigger
              value="Pendientes"
              className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <GoClock className="mr-2 w-4 h-4" />
              <span>Pendientes</span>
              {pendingTrips.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs px-2 py-0.5"
                >
                  {pendingTrips.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="Completados"
              className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <GoCheckCircle className="mr-2 w-4 h-4" />
              <span>Completados</span>
              {completedTrips.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs px-2 py-0.5"
                >
                  {completedTrips.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Pendientes" className="mt-0">
            {pendingTrips && pendingTrips.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                        ID
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Camión
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Conductor
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fecha
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTrips.map((trip) => (
                      <TableRow
                        key={trip.id}
                        className="hover:bg-amber-50/30 transition-colors cursor-pointer border-b border-gray-100"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 border-amber-200 text-amber-700 bg-amber-50 font-medium"
                            >
                              #{trip.id}
                            </Badge>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-gray-100"
                                  onClick={(e) => handleCopyId(e, trip.id)}
                                >
                                  <FiCopy className="h-3 w-3 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs">Copiar ID</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {trip.vehicle_tag}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {trip.driver}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {format(trip.date, { date: "short", time: "short" })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-blue-50"
                                onClick={(e) => handleEditTrip(e, trip)}
                              >
                                <FiEdit className="h-4 w-4 text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">Editar viaje</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState type="pending" />
            )}
          </TabsContent>

          <TabsContent value="Completados" className="mt-0">
            {completedTrips && completedTrips.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider py-4">
                        ID
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Camión
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Conductor
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Concepto
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Monto
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fecha
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedTrips.map((trip) => (
                      <TableRow
                        key={trip.id}
                        onClick={() => onHandleTrip(trip)}
                        className="hover:bg-emerald-50/30 transition-colors cursor-pointer border-b border-gray-100"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 border-emerald-200 text-emerald-700 bg-emerald-50 font-medium"
                            >
                              #{trip.id}
                            </Badge>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-gray-100"
                                  onClick={(e) => handleCopyId(e, trip.id)}
                                >
                                  <FiCopy className="h-3 w-3 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs">Copiar ID</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {trip.vehicle_tag}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {trip.driver}
                        </TableCell>
                        <TableCell>
                          <span
                            className="inline-block max-w-48 truncate text-gray-700"
                            title={trip.concept || ""}
                          >
                            {trip.concept || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {formatToDop(trip.amount || 0)}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {format(trip.date, { date: "short", time: "short" })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState type="completed" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
