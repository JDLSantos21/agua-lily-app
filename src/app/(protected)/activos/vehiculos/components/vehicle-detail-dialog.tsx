"use client";

import { getVehicleConsumption } from "@/api/vehicles";
import { Vehicle, VehicleChartData } from "@/types/vehicles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Car,
  Fuel,
  Info,
  TrendingUp,
  Activity,
  BarChart3,
  Hash,
  FileText,
  Settings,
  User,
  Gauge,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "@formkit/tempo";

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VehicleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export function VehicleDetailDialog({
  open,
  onOpenChange,
  vehicle,
}: VehicleDetailDialogProps) {
  const [consumptionData, setConsumptionData] =
    useState<VehicleChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchConsumptionData = async () => {
      if (vehicle && open) {
        setIsLoading(true);
        try {
          const data = await getVehicleConsumption(vehicle.id);
          setConsumptionData(data);
        } catch (error) {
          console.log("Error fetching consumption data:", error);
          setConsumptionData({ monthlyData: [], recentRecords: [] });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchConsumptionData();
  }, [vehicle, open]);

  if (!vehicle) {
    return null;
  }

  // Prepare chart data from API response
  const prepareChartData = (): ChartData<"line"> => {
    if (
      !consumptionData ||
      !consumptionData.monthlyData ||
      consumptionData.monthlyData.length === 0
    ) {
      return {
        labels: [],
        datasets: [
          {
            label: "Consumo de Combustible",
            data: [],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            tension: 0.3,
          },
          {
            label: "Rendimiento",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            tension: 0.3,
            yAxisID: "y1",
          },
        ],
      };
    }

    // Sort data by month
    const sortedData = [...consumptionData.monthlyData].sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Format month labels (from YYYY-MM to readable format)
    const labels = sortedData.map((item) => {
      const [year, month] = item.month.split("-");
      const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });

    // Gallons data
    const gallonsData = sortedData.map((item) => item.total_gallons);

    // Calculate efficiency (km/gallon)
    const efficiencyData = sortedData.map((item) =>
      item.total_gallons > 0
        ? Number((item.total_kilometers / item.total_gallons).toFixed(2))
        : 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Consumo de Combustible",
          data: gallonsData,
          borderColor: "#3b82f6",
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
            gradient.addColorStop(1, "rgba(59, 130, 246, 0.02)");
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#1d4ed8",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
        },
        {
          label: "Rendimiento",
          data: efficiencyData,
          borderColor: "#10b981",
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
            gradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          yAxisID: "y1",
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#059669",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter, system-ui, -apple-system, sans-serif",
          },
          color: "#6b7280",
          maxRotation: 45,
        },
        border: {
          display: false,
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          display: true,
          color: "rgba(59, 130, 246, 0.1)",
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter, system-ui, -apple-system, sans-serif",
          },
          color: "#3b82f6",
          callback: function (value: any) {
            return value + " gal";
          },
        },
        title: {
          display: true,
          text: "Consumo (gal)",
          font: {
            size: 14,
            family: "Inter, system-ui, -apple-system, sans-serif",
            weight: "bold" as const,
          },
          color: "#3b82f6",
          padding: {
            bottom: 10,
          },
        },
        border: {
          display: false,
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "Inter, system-ui, -apple-system, sans-serif",
          },
          color: "#10b981",
          callback: function (value: any) {
            return value + " km/gal";
          },
        },
        title: {
          display: true,
          text: "Rendimiento (km/gal)",
          font: {
            size: 14,
            family: "Inter, system-ui, -apple-system, sans-serif",
            weight: "bold" as const,
          },
          color: "#10b981",
          padding: {
            bottom: 10,
          },
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 13,
            family: "Inter, system-ui, -apple-system, sans-serif",
            weight: "normal" as const,
          },
          color: "#374151",
          padding: 20,
          generateLabels: function (chart: any) {
            const original =
              ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);

            labels.forEach((label: any, index: number) => {
              label.pointStyle = "circle";
              if (index === 0) {
                label.fillStyle = "#3b82f6";
                label.strokeStyle = "#3b82f6";
              } else if (index === 1) {
                label.fillStyle = "#10b981";
                label.strokeStyle = "#10b981";
              }
            });

            return labels;
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        padding: 12,
        titleFont: {
          size: 14,
          family: "Inter, system-ui, -apple-system, sans-serif",
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
          family: "Inter, system-ui, -apple-system, sans-serif",
          weight: "normal" as const,
        },
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += context.parsed.y + " gal";
              } else {
                label += context.parsed.y + " km/gal";
              }
            }
            return label;
          },
        },
      },
    },
  };

  const GALLON_COST = 200.4;

  // Calculate consumption statistics
  const calculateStatistics = () => {
    if (
      !consumptionData ||
      !consumptionData.monthlyData ||
      consumptionData.monthlyData.length === 0
    ) {
      return {
        averageConsumption: 0,
        averageEfficiency: 0,
        averageCost: 0,
      };
    }

    const totalMonths = consumptionData.monthlyData.length;
    const totalGallons = consumptionData.monthlyData.reduce(
      (sum, item) => sum + item.total_gallons,
      0
    );
    const totalKilometers = consumptionData.monthlyData.reduce(
      (sum, item) => sum + item.total_kilometers,
      0
    );

    const avgConsumption =
      totalMonths > 0 ? Number((totalGallons / totalMonths).toFixed(1)) : 0;
    const avgEfficiency =
      totalGallons > 0
        ? Number((totalKilometers / totalGallons).toFixed(1))
        : 0;
    // Assuming a price of $4 per gallon for the calculation
    const avgCost = Number((avgConsumption * GALLON_COST).toFixed(2));

    return {
      averageConsumption: avgConsumption,
      averageEfficiency: avgEfficiency,
      averageCost: avgCost,
    };
  };

  const stats = calculateStatistics();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span>
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {vehicle.current_tag}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {vehicle.license_plate}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-base">
            Información detallada del vehículo y su historial de consumo
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Detalles del Vehículo
            </TabsTrigger>
            <TabsTrigger
              value="fuelConsumption"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Consumo de Combustible
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Car className="h-5 w-5 text-blue-600" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Marca
                      </span>
                      <span className="text-sm font-semibold">
                        {vehicle.brand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Modelo
                      </span>
                      <span className="text-sm font-semibold">
                        {vehicle.model}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Año
                      </span>
                      <span className="text-sm font-semibold">
                        {vehicle.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-gray-600">
                        TAG
                      </span>
                      <Badge variant="outline" className="font-medium">
                        {vehicle.current_tag}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Hash className="h-5 w-5 text-green-600" />
                    Identificación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Placa
                      </span>
                      <span className="text-sm font-semibold font-mono bg-gray-100 px-2 py-1 rounded">
                        {vehicle.license_plate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium text-gray-600">
                        Chasis
                      </span>
                      <span className="text-sm font-semibold font-mono bg-gray-100 px-2 py-1 rounded">
                        {vehicle.chasis}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Descripción y Notas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {vehicle.description || "Sin descripción disponible."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Información del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        ID del Sistema
                      </span>
                      <span className="text-sm font-semibold font-mono bg-gray-100 px-2 py-1 rounded">
                        {vehicle.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Fecha de Creación
                      </span>
                      <span className="text-sm font-semibold">
                        {format(vehicle.created_at, {
                          date: "medium",
                          time: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Última Actualización
                      </span>
                      <span className="text-sm font-semibold">
                        {format(vehicle.updated_at, {
                          date: "medium",
                          time: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fuelConsumption" className="space-y-6 py-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Fuel className="h-5 w-5 text-blue-600" />
                  Consumo de Combustible
                </CardTitle>
                <CardDescription>
                  Histórico de consumo de combustible mensual
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                ) : consumptionData &&
                  consumptionData.monthlyData &&
                  consumptionData.monthlyData.length > 0 ? (
                  <div className="relative h-[400px] w-full bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-4">
                    <Line options={chartOptions} data={prepareChartData()} />
                  </div>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Fuel className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-center font-medium">
                      No hay datos de consumo disponibles
                    </p>
                    <p className="text-gray-400 text-center text-sm mt-1">
                      Los datos aparecerán aquí cuando se registren consumos
                      para este vehículo
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Últimos Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : consumptionData &&
                  consumptionData.recentRecords &&
                  consumptionData.recentRecords.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Fecha
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <Fuel className="h-3 w-3" />
                              Galones
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <Gauge className="h-3 w-3" />
                              Kilometraje
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Conductor
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {consumptionData.recentRecords.map((record, index) => (
                          <tr
                            key={record.id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {format(record.record_date, { date: "medium" })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <Badge variant="outline" className="font-mono">
                                {record.gallons} gal
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <Badge variant="secondary" className="font-mono">
                                {record.mileage} km
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {record.driver}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-[150px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Calendar className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-center font-medium">
                      No hay registros de reabastecimiento
                    </p>
                    <p className="text-gray-400 text-center text-sm mt-1">
                      Los registros aparecerán aquí cuando se añadan
                      reabastecimientos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Estadísticas de Consumo
                </CardTitle>
                <CardDescription>
                  Métricas promedio basadas en el historial disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-[100px] w-full" />
                    <Skeleton className="h-[100px] w-full" />
                    <Skeleton className="h-[100px] w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center border border-blue-200">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3">
                        <Fuel className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-blue-700 font-medium mb-1">
                        Consumo Promedio
                      </div>
                      <div className="text-2xl font-bold text-blue-800">
                        {stats.averageConsumption > 0
                          ? `${stats.averageConsumption} gal/mes`
                          : "N/A"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center border border-green-200">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-green-700 font-medium mb-1">
                        Rendimiento Promedio
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        {stats.averageEfficiency > 0
                          ? `${stats.averageEfficiency} km/gal`
                          : "N/A"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg text-center border border-amber-200">
                      <div className="flex items-center justify-center w-12 h-12 bg-amber-500 rounded-full mx-auto mb-3">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm text-amber-700 font-medium mb-1">
                        Costo Mensual Promedio
                      </div>
                      <div className="text-2xl font-bold text-amber-800">
                        {stats.averageCost > 0
                          ? new Intl.NumberFormat("es-DO", {
                              style: "currency",
                              currency: "DOP",
                            }).format(stats.averageCost)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[120px]"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
