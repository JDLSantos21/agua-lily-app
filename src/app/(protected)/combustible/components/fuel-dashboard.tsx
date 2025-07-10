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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Gauge, BarChart3 } from "lucide-react";

export const FuelDashboard = () => {
  const { fuel_records, loading } = useFetchDashboard();
  const { fetchFuelAvailability } = useFuelStore((state) => state);

  useEffect(() => {
    fetchFuelAvailability();
  }, []);

  if (loading) return <FuelDashboardSkeleton />;

  return (
    <div className="space-y-6">
      {fuel_records?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Gauge className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay registros de combustible
          </h3>
          <p className="text-gray-500 text-center">
            Comienza registrando el primer consumo de combustible
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Registros</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {fuel_records?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consumo Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {fuel_records?.reduce(
                        (sum, record) => sum + record.gallons,
                        0
                      ) || 0}{" "}
                      gal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Último Registro</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {fuel_records?.[0]?.current_tag || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tabla de registros recientes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    Registros Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-gray-200">
                          <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                            Unidad
                          </TableHead>
                          <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                            Galones
                          </TableHead>
                          <TableHead className="h-12 px-4 text-left text-sm font-medium text-gray-700">
                            Fecha
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fuel_records?.slice(0, 8).map((item) => (
                          <TableRow
                            key={item.id}
                            className="hover:bg-gray-50 border-b border-gray-100"
                          >
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {item.current_tag}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {item.gallons} gal
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">
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
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de combustible */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-orange-600" />
                    </div>
                    Nivel de Combustible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FuelChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
