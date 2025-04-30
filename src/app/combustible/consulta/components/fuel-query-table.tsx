import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FuelRecords } from "@/types/fuel.types";
import FuelQueryTableSkeleton from "./fuel-query-table-skeleton";
import { Info } from "lucide-react";
import { format } from "@formkit/tempo";
import AlertCard from "@/components/alert-card";

export default function FuelQueryTable({
  fuelRecords,
  loading,
}: {
  fuelRecords: FuelRecords | null;
  loading: boolean;
}) {
  if (loading) {
    return <FuelQueryTableSkeleton />;
  }

  console.log(fuelRecords);

  if (fuelRecords === null) {
    return (
      <AlertCard
        description="Realiza una búsqueda para obtener resultados de los registros de
          combustibles."
        title="Información"
        icon={<Info className="h-6 w-6" />}
      />
    );
  }
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[12.5%]">Ficha</TableHead>
          <TableHead className="w-[25%]">Chofer</TableHead>
          <TableHead className="w-[20%]">Kilometraje</TableHead>
          <TableHead className="w-[17.5%]">Galones</TableHead>
          <TableHead className="w-[25%]">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      {fuelRecords.length === 0 ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Sin resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {fuelRecords.map((record) => (
            <TableRow
              key={`${record.mileage}-${record.record_date}-${record.gallons}`}
            >
              <TableCell>{record.current_tag}</TableCell>
              <TableCell>{record.driver}</TableCell>
              <TableCell>{record.mileage}</TableCell>
              <TableCell>{record.gallons}</TableCell>
              <TableCell>
                {format(record.record_date, { date: "medium", time: "short" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
