import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function TableRowSkeleton() {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="p-4">
        <Skeleton className="h-6 w-12 rounded-full" />
      </TableCell>
      <TableCell className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-6" />
        </div>
      </TableCell>
      <TableCell className="p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      </TableCell>
      <TableCell className="p-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function FuelQueryTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-100">
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                Ficha
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                Chofer
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                Kilometraje
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                Galones
              </div>
            </TableHead>
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                Fecha
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
