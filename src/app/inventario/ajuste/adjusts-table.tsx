import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Adjustment } from "@/types/materials/adjustment";

import moment from "moment";
export default function AdjustTable({
  currentData,
}: {
  currentData: Adjustment[];
}) {
  return (
    <Table className="w-full border-collapse">
      <TableHeader>
        <TableRow className="border-b">
          <TableHead className="text-left">Producto</TableHead>
          <TableHead className="text-left">Previo</TableHead>
          <TableHead className="text-left">Nuevo</TableHead>
          <TableHead className="text-left">Motivo</TableHead>
          <TableHead className="text-left">Fecha</TableHead>
          <TableHead className="text-left"> </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="p-2 text-center">
              No hay ajustes registrados.
            </TableCell>
          </TableRow>
        ) : (
          currentData.map((adj) => (
            <TableRow key={adj.id} className="border-b">
              <TableCell className="h-12 p-3">{adj.material_name}</TableCell>
              <TableCell className="p-3 text-red-500">
                {adj.previous_stock}
              </TableCell>
              <TableCell className="p-3 text-green-500">
                {adj.new_stock}
              </TableCell>
              <TableCell className="p-3">{adj.reason}</TableCell>
              <TableCell className="p-3">
                {moment(adj.created_at).format("LLL")}
              </TableCell>
              <TableCell className="p-3"></TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
