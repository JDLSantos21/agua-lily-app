"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Truck,
  ArrowRight,
  Package,
  Activity,
  Settings,
  MapPin,
  Snowflake,
  RefreshCw,
} from "lucide-react";

import { BsBookshelf } from "react-icons/bs";

import { useEquipmentsLocations } from "@/hooks/useEquipments";
import { createCustomIcon, Marker, Popup } from "@/shared/components/Map";

// Leaflet requires the browser `window` object – disable SSR
const LeafletMap = dynamic(() => import("@/shared/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <MapPin className="h-8 w-8 animate-pulse" />
        <span className="text-sm font-medium">Cargando mapa...</span>
      </div>
    </div>
  ),
});

export default function AssetsPage() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const { data: locations, refetch, isFetching } = useEquipmentsLocations();

  const assetCategories = [
    {
      title: "Vehículos",
      description: "Gestión de flota vehicular",
      icon: <Truck className="h-12 w-12 text-blue-600" />,
      href: "/activos/vehiculos",
      color: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200",
      stats: "Ir",
      bgIcon: "bg-blue-100",
    },
    {
      title: "Equipos",
      description: "Control y mantenimiento de equipos",
      icon: <Settings className="h-12 w-12 text-green-600" />,
      href: "/activos/equipments",
      color: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200",
      stats: " ",
      bgIcon: "bg-green-100",
    },
  ];

  const statusColors: Record<string, string> = {
    disponible: "#3b82f6",
    asignado: "#10b981",
    mantenimiento: "#f59e0b",
    inhabilitado: "#ef4444",
  };

  const statusLabels: Record<string, string> = {
    disponible: "Disponible",
    asignado: "Asignado",
    mantenimiento: "Mantenimiento",
    inhabilitado: "Inhabilitado",
  };

  // Icon & color per equipment type
  const typeIcons: Record<
    string,
    React.ComponentType<{ size?: number; color?: string }>
  > = {
    nevera: Snowflake,
    anaquel: BsBookshelf,
  };

  const typeColors: Record<string, string> = {
    nevera: "#3b82f6", // blue
    anaquel: "#10b981", // green
  };

  const getIconForType = (type?: string) =>
    type ? (typeIcons[type.toLowerCase()] ?? Truck) : Truck;

  const getColorForType = (type?: string) =>
    type ? (typeColors[type.toLowerCase()] ?? "#6b7280") : "#6b7280";

  return (
    <ProtectedRoute requiredRole="operador">
      <div className="p-6">
        <div className="max-w-7xl">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Desconocido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Activos Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Desconocido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Vehículos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Desconocido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorías de Activos
            </h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {assetCategories.map((category, index) => (
              <Link href={category.href} key={index} className="no-underline">
                <Card
                  className={`h-full transition-all duration-300 ${category.color} ${category.borderColor} border-2 shadow-sm hover:shadow-md group`}
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 ${category.bgIcon} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        {category.stats}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Map card – opens modal */}
            <div
              className="no-underline cursor-pointer"
              onClick={() => setIsMapOpen(true)}
            >
              <Card className="h-full transition-all duration-300 bg-gray-50 hover:bg-gray-100 border-gray-200 border-2 shadow-sm hover:shadow-md group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-12 w-12 text-gray-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Mapa de Equipos
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Ubicación GPS de los equipos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {locations
                        ? `${locations.length} equipos`
                        : "Cargando..."}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
          <DialogContent className="max-w-[95vw] w-full max-h-[90vh] h-full p-0 gap-0">
            <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg">Mapa de Equipos</DialogTitle>
                  <DialogDescription className="mt-1">
                    {locations
                      ? `${locations.length} equipos con ubicación GPS`
                      : "Cargando ubicaciones..."}
                  </DialogDescription>
                </div>
              </div>

              {/* Status legend + refresh */}
              <div className="flex items-center justify-between pt-3">
                <div className="flex flex-wrap gap-3">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center gap-1.5 text-xs text-gray-500"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: statusColors[key] }}
                      />
                      {label}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Refrescar ubicaciones"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </DialogHeader>

            <div className="flex-1 px-4 pb-4">
              <LeafletMap
                enableClustering
                maxClusterRadius={50}
                height="calc(90vh - 140px)"
              >
                {locations?.map((location) => (
                  <Marker
                    key={location.equipment_id}
                    position={[location.latitude, location.longitude]}
                    icon={createCustomIcon(
                      getIconForType(location.type),
                      getColorForType(location.type),
                      location.model_name,
                    )}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <p className="font-semibold text-gray-900 text-sm mb-1">
                          {location.model_name}
                        </p>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <span className="font-medium">Serie:</span>{" "}
                            {location.serial_number}
                          </p>
                          <p>
                            <span className="font-medium">Tipo:</span>{" "}
                            {location?.type?.toUpperCase()}
                          </p>
                          <p className="flex items-center gap-1">
                            <span className="font-medium">Estado:</span>
                            <span
                              className="inline-block w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  statusColors[location.status] ?? "#6b7280",
                              }}
                            />
                            {statusLabels[location.status] ?? location.status}
                          </p>
                          {location.customer_name && (
                            <p>
                              <span className="font-medium">Cliente:</span>{" "}
                              {location.customer_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LeafletMap>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
