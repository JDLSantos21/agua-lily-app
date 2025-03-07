"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FuelDashboardSkeleton() {
  return (
    <div className="relative w-full flex">
      {/* Skeleton para la tabla (izquierda) */}
      <div className="w-1/2">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2" />{" "}
        {/* Título */}
        <div className="w-48 h-4 bg-gray-200 rounded animate-pulse mb-4" />{" "}
        {/* Subtítulo */}
        <Table className="table-fixed">
          {/* Encabezados de la tabla */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Unidad</TableHead>
              <TableHead className="w-[20%]">Galones</TableHead>
              <TableHead className="w-[50%]">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          {/* Filas de la tabla */}
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-3">
                    <div className="h-6 animate-pulse w-full rounded bg-gray-200"></div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Skeleton para el gráfico (derecha) */}
      <div className="w-1/2 max-w-md mx-auto">
        <div className="w-full max-w-md mx-auto">
          <div>
            <div className="relative w-64 h-64 mx-auto">
              <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-8 bg-gray-300 rounded animate-pulse mb-2" />
                <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
            <div className="mt-6 text-center flex flex-col justify-center items-center">
              <div className="inline-flex items-center gap-2">
                <span className="text-lg">Estado:</span>
                <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
              </div>
              <div className="mt-2 inline-flex items-center gap-2">
                <div className="w-44 h-4 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
