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

  return (
    <TooltipProvider>
      <Tabs className="w-full" defaultValue="Pendientes">
        <TabsList className="mb-4 w-full grid grid-cols-2 h-10 p-1 bg-gray-100 rounded-md">
          <TabsTrigger
            value="Pendientes"
            className="rounded-sm text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <GoClock className="mr-2 w-4 h-4 text-yellow-500" />
            <span>Pendientes</span>
            {pendingTrips.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              >
                {pendingTrips.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="Completados"
            className="rounded-sm text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <GoCheckCircle className="mr-2 w-4 h-4 text-green-500" />
            <span>Completados</span>
            {completedTrips.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-green-100 text-green-700 hover:bg-green-100"
              >
                {completedTrips.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Pendientes">
          {pendingTrips && pendingTrips.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-medium text-gray-600">
                      Conduce
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Camión
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Conductor
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Fecha
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600 text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingTrips.map((trip) => (
                    <TableRow
                      key={trip.id}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0 h-5 border-yellow-300 text-yellow-700 bg-yellow-50"
                          >
                            #{trip.id}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
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
                      <TableCell className="font-medium">
                        {trip.vehicle_tag}
                      </TableCell>
                      <TableCell>{trip.driver}</TableCell>
                      <TableCell>
                        {format(trip.date, { date: "short", time: "short" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => handleEditTrip(e, trip)}
                            >
                              <FiEdit className="h-4 w-4 text-blue-500" />
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
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-40 border rounded-md bg-gray-50/50 flex flex-col items-center justify-center text-center p-6"
            >
              <GoClock className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                No hay viajes pendientes en la fecha seleccionada.
              </p>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="Completados">
          {completedTrips && completedTrips.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-medium text-gray-600">
                      Conduce
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Camión
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Conductor
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Concepto
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Monto
                    </TableHead>
                    <TableHead className="text-xs font-medium text-gray-600">
                      Fecha
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedTrips.map((trip) => (
                    <TableRow
                      key={trip.id}
                      onClick={() => onHandleTrip(trip)}
                      className="hover:bg-green-50/30 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0 h-5 border-green-300 text-green-700 bg-green-50"
                          >
                            #{trip.id}
                          </Badge>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
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
                      <TableCell className="font-medium">
                        {trip.vehicle_tag}
                      </TableCell>
                      <TableCell>{trip.driver}</TableCell>
                      <TableCell>
                        <span
                          className="inline-block max-w-40 truncate"
                          title={trip.concept || ""}
                        >
                          {trip.concept}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatToDop(trip.amount || 0)}
                      </TableCell>
                      <TableCell>
                        {format(trip.date, { date: "short", time: "short" })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-40 border rounded-md bg-gray-50/50 flex flex-col items-center justify-center text-center p-6"
            >
              <GoCheckCircle className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                No hay viajes completados en la fecha seleccionada.
              </p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
}
