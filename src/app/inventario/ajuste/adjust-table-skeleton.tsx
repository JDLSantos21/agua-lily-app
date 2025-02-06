import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
export default function AdjustTableSkeleton() {
  return (
    <Table className="w-full border-collapse">
      {/* Encabezado de la tabla */}
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
      {/* Filas de la tabla */}
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i} className="border-b">
            <TableCell className="h-12 p-3">
              <Skeleton className="h-full" />
            </TableCell>
            <TableCell className="h-12 p-3">
              <Skeleton className="h-full" />
            </TableCell>
            <TableCell className="h-12 p-3">
              <Skeleton className="h-full" />
            </TableCell>
            <TableCell className="h-12 p-3">
              <Skeleton className="h-full" />
            </TableCell>
            <TableCell className="h-12 p-3">
              <Skeleton className="h-full" />
            </TableCell>
            <TableCell className="h-12 p-3">
              <Skeleton className="h-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
