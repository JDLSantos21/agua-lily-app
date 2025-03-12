import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FuelRecords } from "@/types/fuel.types";
import moment from "moment";
import FuelQueryTableSkeleton from "./fuel-query-table-skeleton";

export default function FuelQueryTable({
  fuelRecords,
  loading,
}: {
  fuelRecords: FuelRecords;
  loading: boolean;
}) {
  if (loading) {
    return <FuelQueryTableSkeleton />;
  }

  console.log(fuelRecords);
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
              No se encontraron registros con esos filtros.
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {fuelRecords.map((record) => (
            <TableRow key={`${record.mileage}-${record.record_date}-${record.gallons}`}>
              <TableCell>{record.current_tag}</TableCell>
              <TableCell>{record.driver}</TableCell>
              <TableCell>{record.mileage}</TableCell>
              <TableCell>{record.gallons}</TableCell>
              <TableCell>
                {moment(record.record_date).format("DD/MM/YYYY HH:mm:ss")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}
