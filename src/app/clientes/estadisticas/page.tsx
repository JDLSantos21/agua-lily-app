// src/app/clientes/estadisticas/page.tsx - VERSIÓN MEJORADA
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CustomerStats } from "../components/customer-stats";
import { LoaderSpin } from "@/components/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  TooltipProps,
} from "recharts";
import { useCustomerStats } from "@/hooks/useCustomers";

export default function EstadisticasPage() {
  const { data: customerStats, isLoading, error, refetch } = useCustomerStats();
  // Si está cargando, mostrar indicador
  if (isLoading) {
    return <LoaderSpin text="Cargando estadísticas..." />;
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-3xl mt-10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
        <div className="mt-4">
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </Alert>
    );
  }

  // Si no hay datos disponibles
  if (!customerStats) {
    return (
      <div className="container p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Estadísticas de Clientes</h1>
          <Link href="/clientes">
            <Button variant="outline" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver a clientes
            </Button>
          </Link>
        </div>

        <Alert className="mx-auto max-w-3xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Sin datos</AlertTitle>
          <AlertDescription>
            No hay datos de estadísticas disponibles. Intente nuevamente más
            tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Preparar datos para gráficos
  const tipoClientesData = [
    { name: "Empresas", value: customerStats.data.clientes_empresa },
    { name: "Individuales", value: customerStats.data.clientes_individuales },
  ];

  const estadoClientesData = [
    { name: "Activos", value: customerStats.data.clientes_activos },
    { name: "Inactivos", value: customerStats.data.clientes_inactivos },
  ];

  const comparacionData = [
    {
      name: "Total",
      value: customerStats.data.total_clientes,
      fill: "#3b82f6",
    },
    {
      name: "Empresas",
      value: customerStats.data.clientes_empresa,
      fill: "#1e40af",
    },
    {
      name: "Individuales",
      value: customerStats.data.clientes_individuales,
      fill: "#6b7280",
    },
    {
      name: "Activos",
      value: customerStats.data.clientes_activos,
      fill: "#22c55e",
    },
    {
      name: "Inactivos",
      value: customerStats.data.clientes_inactivos,
      fill: "#ef4444",
    },
  ];

  // Colores para los gráficos
  const COLORS_TYPE = ["#1e40af", "#6b7280"];
  const COLORS_STATUS = ["#22c55e", "#ef4444"];

  // Formateador para tooltips
  const renderTooltipContent = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm">{`${payload[0].value} clientes (${Math.round(((payload[0].value as number) / customerStats.data.total_clientes) * 100)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Estadísticas de Clientes</h1>
        <Link href="/clientes">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver a clientes
          </Button>
        </Link>
      </div>

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
            <CardDescription>
              Proporción de clientes empresariales vs individuales
            </CardDescription>
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
                <Tooltip content={renderTooltipContent} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
            <CardDescription>
              Proporción de clientes activos vs inactivos
            </CardDescription>
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
                <Tooltip content={renderTooltipContent} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de barras para comparar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Comparación de Estadísticas</CardTitle>
            <CardDescription>
              Visualización comparativa de todas las métricas
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparacionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip content={renderTooltipContent} />
                <Bar dataKey="value" name="Cantidad" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Información adicional */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Análisis de clientes</CardTitle>
              <CardDescription>
                Resumen general del estado de clientes
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              El panel de estadísticas muestra un total de{" "}
              <strong>{customerStats.data.total_clientes}</strong> clientes
              registrados en el sistema, de los cuales{" "}
              <strong>{customerStats.data.clientes_empresa}</strong> son
              empresas ({" "}
              {customerStats.data.total_clientes > 0
                ? (
                    (customerStats.data.clientes_empresa /
                      customerStats.data.total_clientes) *
                    100
                  ).toFixed(0)
                : 0}
              %) y <strong>{customerStats.data.clientes_individuales}</strong>{" "}
              son clientes individuales ({" "}
              {customerStats.data.total_clientes > 0
                ? (
                    (customerStats.data.clientes_individuales /
                      customerStats.data.total_clientes) *
                    100
                  ).toFixed(0)
                : 0}
              %).
            </p>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">
                Estado de actividad de clientes
              </h4>
              <p className="text-gray-600">
                Actualmente hay{" "}
                <strong>{customerStats.data.clientes_activos}</strong> clientes
                activos ({" "}
                {customerStats.data.total_clientes > 0
                  ? (
                      (customerStats.data.clientes_activos /
                        customerStats.data.total_clientes) *
                      100
                    ).toFixed(0)
                  : 0}
                %) y <strong>{customerStats.data.clientes_inactivos}</strong>{" "}
                clientes inactivos ({" "}
                {customerStats.data.total_clientes > 0
                  ? (
                      (customerStats.data.clientes_inactivos /
                        customerStats.data.total_clientes) *
                      100
                    ).toFixed(0)
                  : 0}
                %). Esta información es útil para estrategias de marketing y
                retención.
              </p>
            </div>

            <div className="mt-4 p-3 border border-blue-100 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">
                Recomendaciones
              </h4>
              <ul className="text-blue-700 space-y-2 list-disc pl-5">
                <li>
                  Considere estrategias de reactivación para los{" "}
                  {customerStats.data.clientes_inactivos} clientes inactivos.
                </li>
                <li>
                  Revise periódicamente el estado de los clientes para mantener
                  la base de datos actualizada.
                </li>
                <li>
                  Para un análisis más completo, considere examinar también la
                  actividad de los clientes en relación a sus equipos.
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar datos
            </Button>
            <Link href="/clientes">
              <Button variant="primary" className="flex items-center gap-1">
                Gestionar clientes
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
