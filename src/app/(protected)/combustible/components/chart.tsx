"use client";
// import { fuelAvailability } from "@/types/fuel.types";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);
import { Doughnut } from "react-chartjs-2";
import { useFuelStore } from "@/stores/fuelStore";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const FuelChart = () => {
  const { available } = useFuelStore();

  const MAX_CAPACITY = 1500;
  const AVAILABLE_FUEL = Number(available);

  const fuelLevel = (AVAILABLE_FUEL / MAX_CAPACITY) * 100;

  const chartData = {
    labels: ["Disponible", "Usado"],
    datasets: [
      {
        data: [AVAILABLE_FUEL, MAX_CAPACITY - AVAILABLE_FUEL],
        backgroundColor: ["#f97316", "#f1f5f9"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const chartOptions = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const FUEL_LIMIT = 20; // 20%
  const fuelStatus = fuelLevel > FUEL_LIMIT ? "Suficiente" : "Bajo";
  const fuelStatusColor =
    fuelLevel > FUEL_LIMIT ? "text-green-600" : "text-red-600";
  const fuelStatusIcon = fuelLevel > FUEL_LIMIT ? CheckCircle : AlertTriangle;
  const StatusIcon = fuelStatusIcon;

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="w-48 h-48 mx-auto">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {Math.round(fuelLevel)}%
            </p>
            <p className="text-sm text-gray-500">
              {AVAILABLE_FUEL} / {MAX_CAPACITY} gal
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <StatusIcon className={`h-5 w-5 ${fuelStatusColor}`} />
          <span className={`font-semibold ${fuelStatusColor}`}>
            {fuelStatus}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Rango Estimado
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {Math.round(AVAILABLE_FUEL * 11).toLocaleString()} km
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                fuelLevel > FUEL_LIMIT ? "bg-orange-500" : "bg-red-500"
              }`}
              style={{ width: `${fuelLevel}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium">DISPONIBLE</p>
            <p className="text-lg font-semibold text-blue-900">
              {AVAILABLE_FUEL}
            </p>
            <p className="text-xs text-blue-600">galones</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 font-medium">CAPACIDAD</p>
            <p className="text-lg font-semibold text-gray-900">
              {MAX_CAPACITY}
            </p>
            <p className="text-xs text-gray-600">galones</p>
          </div>
        </div>
      </div>
    </div>
  );
};
