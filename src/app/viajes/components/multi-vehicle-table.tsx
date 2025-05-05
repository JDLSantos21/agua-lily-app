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
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Vehículo</TableHead>
            <TableHead className="font-bold text-center">
              Viajes Estándar
            </TableHead>
            <TableHead className="font-bold text-center">
              Viajes Rápidos
            </TableHead>
            <TableHead className="font-bold text-center">
              Comisión por ventas
            </TableHead>
            <TableHead className="font-bold text-center">
              Total Viajes
            </TableHead>
            <TableHead className="font-bold text-right">
              Total a Pagar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.vehicleId}>
              <TableCell className="font-medium">
                {vehicle.vehicleTag}
              </TableCell>
              <TableCell className="text-center">
                <TripBadge
                  type="Viaje Estándar"
                  count={vehicle.standardTrips}
                />
              </TableCell>
              <TableCell className="text-center">
                <TripBadge type="Viaje Rapido" count={vehicle.quickTrips} />
              </TableCell>
              <TableCell className="text-center">
                <TripBadge
                  type="Comisión por ventas"
                  count={vehicle.commissionTrips}
                />
              </TableCell>
              <TableCell className="text-center font-medium">
                {vehicle.totalTrips}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatToDop(vehicle.totalAmount)}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals row */}
          <TableRow className="bg-muted/50">
            <TableCell className="font-bold">TOTALES</TableCell>
            <TableCell className="text-center font-bold">
              {vehicles.reduce(
                (sum, vehicle) => sum + vehicle.standardTrips,
                0
              )}
            </TableCell>
            <TableCell className="text-center font-bold">
              {vehicles.reduce((sum, vehicle) => sum + vehicle.quickTrips, 0)}
            </TableCell>
            <TableCell className="text-center font-bold">
              {vehicles.reduce(
                (sum, vehicle) => sum + vehicle.commissionTrips,
                0
              )}
            </TableCell>
            <TableCell className="text-center font-bold">
              {totals.totalTrips}
            </TableCell>
            <TableCell className="text-right font-bold">
              {formatToDop(totals.totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
});

export default MultiVehicleTable;
