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
import { motion } from "framer-motion";
import { Info } from "lucide-react";

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

  console.log(fuelRecords)

  if(fuelRecords === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-muted-foreground select-none text-lg border p-2 w-96 mx-auto"
      >
        <div className="flex items-center justify-center text-blue-400 space-x-2 text-sm">
        <Info className="h-6 w-6" />
        <p>

        Información
        </p>
        </div>
        <div className="text-center text-sm py-2 text-gray-600">
          Realiza una búsqueda para obtener resultados de los registros de combustibles.
        </div>
      </motion.div>
    )
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
