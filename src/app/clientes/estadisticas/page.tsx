// src/app/clientes/estadisticas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerStats } from "../components/customer-stats";
import { useCustomerStats } from "@/hooks/useCustomers";
import { LoaderSpin } from "@/components/Loader";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function EstadisticasPage() {
  const { data, isLoading, error } = useCustomerStats();
  const stats = data?.data;

  // Datos para los gráficos
  const [tipoClientesData, setTipoClientesData] = useState<any[]>([]);
  const [estadoClientesData, setEstadoClientesData] = useState<any[]>([]);

  // Actualizar datos cuando cambian las estadísticas
  useEffect(() => {
    if (stats) {
      // Datos para gráfico de tipo de clientes
      setTipoClientesData([
        { name: "Empresas", value: stats.clientes_empresa },
        { name: "Individuales", value: stats.clientes_individuales },
      ]);

      // Datos para gráfico de estado de clientes
      setEstadoClientesData([
        { name: "Activos", value: stats.clientes_activos },
        { name: "Inactivos", value: stats.clientes_inactivos },
      ]);
    }
  }, [stats]);

  // Colores para los gráficos
  const COLORS_TYPE = ["#1e40af", "#6b7280"];
  const COLORS_STATUS = ["#22c55e", "#ef4444"];

  if (isLoading) {
    return <LoaderSpin text="Cargando estadísticas..." />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 my-8">
        Error al cargar las estadísticas. Por favor, intente nuevamente.
      </div>
    );
  }

  return (
    <div className="container p-4 space-y-8">
      <h1 className="text-2xl font-bold">Estadísticas de Clientes</h1>

      {/* Resumen de estadísticas */}
      <section>
        <CustomerStats />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución por tipo de cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tipoClientesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tipoClientesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_TYPE[index % COLORS_TYPE.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip
                  formatter={(value) => [`${value} clientes`, "Cantidad"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadoClientesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {estadoClientesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_STATUS[index % COLORS_STATUS.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip
                  formatter={(value) => [`${value} clientes`, "Cantidad"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de barras para comparar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Comparación de Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Total", value: stats?.total_clientes || 0 },
                  { name: "Empresas", value: stats?.clientes_empresa || 0 },
                  {
                    name: "Individuales",
                    value: stats?.clientes_individuales || 0,
                  },
                  { name: "Activos", value: stats?.clientes_activos || 0 },
                  { name: "Inactivos", value: stats?.clientes_inactivos || 0 },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} clientes`, "Cantidad"]}
                />
                <Legend />
                <Bar dataKey="value" name="Cantidad" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Información adicional */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Análisis de clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              El panel de estadísticas muestra un total de{" "}
              {stats?.total_clientes || 0} clientes registrados en el sistema,
              de los cuales
              {stats?.clientes_empresa || 0} son empresas y{" "}
              {stats?.clientes_individuales || 0} son clientes individuales.
              Actualmente hay {stats?.clientes_activos || 0} clientes activos (
              {stats?.clientes_activos && stats?.total_clientes
                ? (
                    (stats.clientes_activos / stats.total_clientes) *
                    100
                  ).toFixed(0)
                : 0}
              %) y {stats?.clientes_inactivos || 0} clientes inactivos (
              {stats?.clientes_inactivos && stats?.total_clientes
                ? (
                    (stats.clientes_inactivos / stats.total_clientes) *
                    100
                  ).toFixed(0)
                : 0}
              %).
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
