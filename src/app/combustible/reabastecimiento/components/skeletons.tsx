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
          <TableRow>
            <TableHead className="w-[20%]">Galones</TableHead>
            <TableHead className="w-[40%]">Fecha</TableHead>
            <TableHead className="w-[40%]">Usuario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="h-[53px] p-2">
                <Skeleton className="h-full" />
              </TableCell>
              <TableCell className="h-[53px] p-2">
                <Skeleton className="h-full" />
              </TableCell>
              <TableCell className="h-[53px] p-2">
                <Skeleton className="h-full" />
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
    <div className="w-full h-[300px]">
      <div className="mb-1 w-full">
        <Skeleton className="h-5 w-2/5 mx-auto" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
};
