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
import {
  Search,
  User,
  Gauge,
  Droplets,
  Calendar,
  FileText,
} from "lucide-react";
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

  if (fuelRecords === null) {
    return (
      <div className="p-8">
        <AlertCard
          description="Utiliza los filtros de búsqueda para obtener resultados de los registros de combustible. Puedes buscar por ficha del vehículo, rango de fechas o ambos."
          title="Sin búsqueda activa"
          icon={<Search className="h-6 w-6" />}
        />
      </div>
    );
  }

  if (fuelRecords.length === 0) {
    return (
      <div className="p-8">
        <AlertCard
          description="No se encontraron registros que coincidan con los criterios de búsqueda. Intenta modificar los filtros."
          title="Sin resultados"
          icon={<FileText className="h-6 w-6" />}
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-100">
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ficha
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Chofer
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Kilometraje
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Galones
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fuelRecords.map((record) => (
            <TableRow
              key={`${record.mileage}-${record.record_date}-${record.gallons}`}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  {record.current_tag}
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  {record.driver}
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{record.mileage}</span>
                  <span className="text-gray-500 text-sm">km</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {record.gallons}
                  </span>
                  <span className="text-gray-500 text-sm">gal</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="text-sm">
                  <div className="font-medium">
                    {format(record.record_date, { date: "medium" })}
                  </div>
                  <div className="text-gray-500">
                    {format(record.record_date, { time: "short" })}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
