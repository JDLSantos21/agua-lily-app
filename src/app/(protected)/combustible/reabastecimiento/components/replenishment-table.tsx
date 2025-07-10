import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRecentReplenishments } from "@/api/fuel";
import { format } from "@formkit/tempo";
import { Droplets, User, Calendar } from "lucide-react";

interface ReplenishmentRecord {
  id: number;
  gallons: number;
  replenishment_date: string;
  user: string;
}

export default async function ReplenishmentTable() {
  // Obtener los registros de reabastecimiento en el servidor
  const records: ReplenishmentRecord[] = await fetchRecentReplenishments();

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-100">
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
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuario
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            // Si no hay registros, mostrar un mensaje
            !records?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Droplets className="h-12 w-12 text-gray-300" />
                    <p className="text-lg font-medium">No hay registros</p>
                    <p className="text-sm">
                      No se encontraron reabastecimientos recientes
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )
          }
          {records?.map((record, index) => (
            <TableRow
              key={index}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {record.gallons}
                  </span>
                  <span className="text-gray-500 text-sm">gal</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-700">
                {format(record.replenishment_date, { date: "long" })}
              </TableCell>
              <TableCell className="text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  {record.user}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
