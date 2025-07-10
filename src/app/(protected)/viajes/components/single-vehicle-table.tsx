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
import { Badge } from "@/components/ui/badge";
import TripBadge from "./trip-badge";
import { VehicleSummary } from "../types/trips";
import { Calendar, Hash, User, BarChart3, DollarSign } from "lucide-react";

interface SingleVehicleTableProps {
  vehicle: VehicleSummary;
  onConduceClick: (conduceId: number, date: string) => void;
}

/**
 * Table component for a single vehicle's trip data
 */
const SingleVehicleTable = memo(function SingleVehicleTable({
  vehicle,
  onConduceClick,
}: SingleVehicleTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Detalle de Viajes Diarios
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Registro completo de actividad del vehículo
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total Viajes
              </p>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  {vehicle.totalTrips}
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Total a Pagar
              </p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-xl font-bold text-green-700">
                  {formatToDop(vehicle.totalAmount)}
                </span>
              </div>
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
                  <Calendar className="h-4 w-4" />
                  Fecha
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Conduces
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                Concepto
              </TableHead>
              <TableHead className="font-semibold text-gray-700 py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Conductor
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center py-4">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Cantidad
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right py-4">
                <div className="flex items-center justify-end gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicle.dailyTrips.map((day, index) => (
              <TableRow
                key={`${day.dayStr}-${day.concept}-${day.driver}`}
                className={`
                  transition-colors hover:bg-indigo-50/50 border-b border-gray-100
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                `}
              >
                <TableCell className="font-medium py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-900">{day.dayStr}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1">
                    {day.conduces.map((conduceId) => (
                      <Badge
                        key={conduceId}
                        variant="outline"
                        className="cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 text-xs font-medium"
                        onClick={() => onConduceClick(conduceId, day.dayStr)}
                      >
                        #{conduceId}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <TripBadge type={day.concept}>{day.tripCount}</TripBadge>
                    <span className="text-gray-700">{day.concept}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-gray-700 font-medium">{day.driver}</div>
                </TableCell>
                <TableCell className="text-center py-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {day.tripCount}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="font-semibold text-gray-900 text-lg">
                    {formatToDop(day.totalAmount)}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Totals row */}
            <TableRow className="bg-gradient-to-r from-indigo-100 to-blue-100 border-t-2 border-indigo-200">
              <TableCell colSpan={4} className="font-bold text-indigo-900 py-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  TOTALES DEL VEHÍCULO
                </div>
              </TableCell>
              <TableCell className="text-center font-bold py-5">
                <div className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-200 text-indigo-900 rounded-full font-bold">
                  {vehicle.totalTrips}
                </div>
              </TableCell>
              <TableCell className="text-right font-bold py-5">
                <div className="text-xl font-bold text-indigo-900">
                  {formatToDop(vehicle.totalAmount)}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export default SingleVehicleTable;
