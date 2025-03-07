import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableRowSkeleton() {
  return (
    <tr>
      {/* Material */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
      </td>
      {/* Categoria */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
      </td>
      {/* Kilometraje */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
      </td>
      {/* Galones */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
      </td>
      {/* Fecha */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
      </td>
    </tr>
  );
}

export default function FuelQueryTableSkeleton() {
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
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRowSkeleton key={index} />
        ))}
      </TableBody>
    </Table>
  );
}
