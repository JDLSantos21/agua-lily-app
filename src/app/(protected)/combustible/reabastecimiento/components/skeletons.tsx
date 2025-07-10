import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ReplenishmentTableSkeleton = () => {
  return (
    <div className="space-y-4 w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-100">
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
            <TableHead className="text-gray-700 font-semibold">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                Usuario
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="h-[60px] p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </TableCell>
              <TableCell className="h-[60px] p-4">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="h-[60px] p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const ReplenishmentChartSkeleton = () => {
  return (
    <div className="w-full h-64">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
};
