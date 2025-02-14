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
          <TableHead className="text-left w-[30%]">Producto</TableHead>
          <TableHead className="text-left w-[10%]">Previo</TableHead>
          <TableHead className="text-left w-[10%]">Nuevo</TableHead>
          <TableHead className="text-left w-[23%]">Motivo</TableHead>
          <TableHead className="text-left w-[27%]">Fecha</TableHead>
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
