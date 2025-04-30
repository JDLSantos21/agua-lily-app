"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FuelChart } from "./chart";
import FuelDashboardSkeleton from "./fuel-dashboard-skeleton";
import useFetchDashboard from "@/hooks/useFetchDashboard";
import { format } from "@formkit/tempo";
import { useFuelStore } from "@/stores/fuelStore";
import { useEffect } from "react";

export const FuelDashboard = () => {
  const { fuel_records, loading } = useFetchDashboard();
  const { fetchFuelAvailability } = useFuelStore((state) => state);

  useEffect(() => {
    fetchFuelAvailability();
  }, []);

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
                      {format(item.record_date, {
                        date: "medium",
                        time: "short",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <FuelChart />
        </div>
      )}
    </div>
  );
};
