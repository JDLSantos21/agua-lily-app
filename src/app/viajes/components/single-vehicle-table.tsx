import { memo } from "react";
import { format } from "@formkit/tempo";
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
  console.log("daily: ", vehicle.dailyTrips);
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-bold">Fecha</TableHead>
            <TableHead className="font-bold">Conduces</TableHead>
            <TableHead className="font-bold">Concepto</TableHead>
            <TableHead className="font-bold">Conductor</TableHead>
            <TableHead className="font-bold text-center">Cantidad</TableHead>
            <TableHead className="font-bold text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicle.dailyTrips.map((day) => (
            <TableRow key={`${day.dayStr}-${day.concept}-${day.driver}`}>
              <TableCell className="font-medium">
                {format(day.day, "DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {day.conduces.map((conduceId) => (
                    <Badge
                      key={conduceId}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() =>
                        onConduceClick(conduceId, format(day.day, "YYYY-MM-DD"))
                      }
                    >
                      #{conduceId}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <TripBadge type={day.concept}>{day.tripCount}</TripBadge>{" "}
                {day.concept}
              </TableCell>
              <TableCell>{day.driver}</TableCell>
              <TableCell className="text-center">{day.tripCount}</TableCell>
              <TableCell className="text-right font-medium">
                {formatToDop(day.totalAmount)}
              </TableCell>
            </TableRow>
          ))}

          {/* Totals row */}
          <TableRow className="bg-muted/50">
            <TableCell colSpan={4} className="font-bold">
              TOTALES
            </TableCell>
            <TableCell className="text-center font-bold">
              {vehicle.totalTrips}
            </TableCell>
            <TableCell className="text-right font-bold">
              {formatToDop(vehicle.totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
});

export default SingleVehicleTable;
