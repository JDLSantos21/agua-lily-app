"use client";

import { Vehicle, getVehicleConsumption } from "@/api/vehicles";
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
import { AlertCircle, Calendar, Car, Fuel } from "lucide-react";
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
import { VehicleChartData } from "@/types/vehicles";
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
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
        },
        {
          label: "Rendimiento",
          data: efficiencyData,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.3,
          yAxisID: "y1",
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Consumo (gal)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Rendimiento (km/gal)",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Histórico de Consumo de Combustible",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {vehicle.brand} {vehicle.model} {vehicle.year}
            <Badge variant="outline" className="ml-2">
              {vehicle.current_tag}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información detallada del vehículo y su historial de consumo
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Detalles del Vehículo</TabsTrigger>
            <TabsTrigger value="fuelConsumption">
              Consumo de Combustible
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Marca</div>
                    <div className="text-sm">{vehicle.brand}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Modelo</div>
                    <div className="text-sm">{vehicle.model}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Año</div>
                    <div className="text-sm">{vehicle.year}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">TAG</div>
                    <div className="text-sm">{vehicle.current_tag}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Identificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Placa</div>
                    <div className="text-sm">{vehicle.license_plate}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Chasis</div>
                    <div className="text-sm">{vehicle.chasis}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Descripción y Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {vehicle.description || "Sin descripción disponible."}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">ID del Sistema</div>
                    <div className="text-sm">{vehicle.id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Fecha de Creación</div>
                    <div className="text-sm">
                      {format(vehicle.created_at, {
                        date: "long",
                        time: "short",
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Actualizado</div>
                    <div className="text-sm">
                      {format(vehicle.updated_at, {
                        date: "long",
                        time: "short",
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fuelConsumption" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  Consumo de Combustible
                </CardTitle>
                <CardDescription>
                  Histórico de consumo de combustible mensual
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : consumptionData &&
                  consumptionData.monthlyData &&
                  consumptionData.monthlyData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <Line options={chartOptions} data={prepareChartData()} />
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground text-center">
                      No hay datos de consumo disponibles para este vehículo.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Últimos registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : consumptionData &&
                  consumptionData.recentRecords &&
                  consumptionData.recentRecords.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            Fecha
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            Galones
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            Kilometraje
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            Conductor
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {consumptionData.recentRecords.map((record) => (
                          <tr key={record.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {format(record.record_date, { date: "medium" })}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {record.gallons}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {record.mileage}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {record.driver}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-[100px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground text-center">
                      No hay registros de reabastecimiento para este vehículo.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Estadísticas de Consumo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[100px] w-full" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-blue-700 font-medium">
                        Consumo Promedio
                      </div>
                      <div className="text-2xl font-bold text-blue-800">
                        {stats.averageConsumption > 0
                          ? `${stats.averageConsumption} gal/mes`
                          : "N/A"}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-green-700 font-medium">
                        Rendimiento Promedio
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        {stats.averageEfficiency > 0
                          ? `${stats.averageEfficiency} km/gal`
                          : "N/A"}
                      </div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-amber-700 font-medium">
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
