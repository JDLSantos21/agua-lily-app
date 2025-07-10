import { memo } from "react";
import { formatToDop } from "@/utils/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VehicleSummary, TripTotals } from "../types/trips";
import TripBadge from "./trip-badge";
import { Truck, TrendingUp, DollarSign } from "lucide-react";

interface MultiVehicleTableProps {
  vehicles: VehicleSummary[];
  totals: TripTotals;
}

/**
 * Table component for multiple vehicles summary
 */
const MultiVehicleTable = memo(function MultiVehicleTable({
  vehicles,
  totals,
}: MultiVehicleTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Truck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Resumen por Vehículo
            </h3>
            <p className="text-sm text-gray-600">
              {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""} •{" "}
              {totals.totalTrips} viajes totales
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-right">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total General
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatToDop(totals.totalAmount)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700 py-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vehículo
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center py-4">
                Viajes Estándar
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center py-4">
                Viajes Rápidos
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center py-4">
                Comisión por ventas
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center py-4">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Viajes
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right py-4">
                <div className="flex items-center justify-end gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total a Pagar
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle, index) => (
              <TableRow
                key={vehicle.vehicleId}
                className={`
                  transition-colors hover:bg-gray-50/80 
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                `}
              >
                <TableCell className="py-4">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {vehicle.vehicleTag}
                  </div>
                </TableCell>
                <TableCell className="text-center py-4">
                  <TripBadge
                    type="Viaje Estándar"
                    count={vehicle.standardTrips}
                  />
                </TableCell>
                <TableCell className="text-center py-4">
                  <TripBadge type="Viaje Rapido" count={vehicle.quickTrips} />
                </TableCell>
                <TableCell className="text-center py-4">
                  <TripBadge
                    type="Comisión por ventas"
                    count={vehicle.commissionTrips}
                  />
                </TableCell>
                <TableCell className="text-center py-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {vehicle.totalTrips}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="font-semibold text-gray-900 text-lg">
                    {formatToDop(vehicle.totalAmount)}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Totals row */}
            <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-200">
              <TableCell className="font-bold text-gray-900 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  TOTALES GENERALES
                </div>
              </TableCell>
              <TableCell className="text-center font-bold text-gray-900 py-5">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                  {vehicles.reduce(
                    (sum, vehicle) => sum + vehicle.standardTrips,
                    0
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-bold text-gray-900 py-5">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                  {vehicles.reduce(
                    (sum, vehicle) => sum + vehicle.quickTrips,
                    0
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-bold text-gray-900 py-5">
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                  {vehicles.reduce(
                    (sum, vehicle) => sum + vehicle.commissionTrips,
                    0
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-bold text-gray-900 py-5">
                <div className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                  {totals.totalTrips}
                </div>
              </TableCell>
              <TableCell className="text-right font-bold text-gray-900 py-5">
                <div className="text-xl font-bold text-green-700">
                  {formatToDop(totals.totalAmount)}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export default MultiVehicleTable;
