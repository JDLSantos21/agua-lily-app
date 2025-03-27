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
    <div className="space-y-4 ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Galones</TableHead>
            <TableHead className="w-[40%]">Fecha</TableHead>
            <TableHead className="w-[40%]">Usuario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            // Si no hay registros, mostrar un mensaje
            !records?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No hay registros de reabastecimiento
                </TableCell>
              </TableRow>
            )
          }
          {records?.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.gallons}</TableCell>
              <TableCell>
                {format(record.replenishment_date, { date: "long" })}
              </TableCell>
              <TableCell>{record.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
