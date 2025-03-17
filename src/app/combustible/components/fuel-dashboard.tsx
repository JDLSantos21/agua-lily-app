"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { FuelChart } from "./chart";
import FuelDashboardSkeleton from "./fuel-dashboard-skeleton";
import useFetchDashboard from "@/hooks/useFetchDashboard";

export const FuelDashboard = () => {
  const { fuel_records, loading, availability } = useFetchDashboard();

  if (loading) return <FuelDashboardSkeleton />;

  return (
    <div className="flex">
      {fuel_records?.length === 0 ? (
        <h1>No hay registros de combustible</h1>
      ) : (
        <div className="relative w-full flex justify-between">
          <div className="w-1/2">
            <h1 className="text-xl font-bold font-Inter">Resumen</h1>
            <p className="text-sm text-gray-500">
              Registros de combustible más recientes.
            </p>
            <Table className="mt-4 table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Unidad</TableHead>
                  <TableHead className="w-[20%]">Galones</TableHead>
                  <TableHead className="w-[50%]">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuel_records?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.current_tag}</TableCell>
                    <TableCell>{item.gallons}</TableCell>
                    <TableCell>
                      {moment(item.record_date).format("LL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {availability && <FuelChart data={availability} />}
        </div>
      )}
    </div>
  );
};
