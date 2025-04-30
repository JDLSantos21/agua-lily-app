"use client";
// import { fuelAvailability } from "@/types/fuel.types";
import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);
import { Doughnut } from "react-chartjs-2";
import { useFuelStore } from "@/stores/fuelStore";

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
        backgroundColor: ["#3b82f6", "#e2e8f0"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
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
    fuelLevel > FUEL_LIMIT ? "text-green-500" : "text-red-500";

  return (
    <div className=" max-w-md mx-auto">
      <div>
        <div className="relative w-64 h-64 mx-auto">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-center font-bold text-3xl mb-2">
              {Math.round(fuelLevel)}%
            </p>
            <p className="text-lg">
              {AVAILABLE_FUEL} / {MAX_CAPACITY}
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Estado{" "}
            <span className={`font-semibold text-lg ${fuelStatusColor}`}>
              {fuelStatus}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span>Rango Estimado</span>{" "}
            <span className="font-bold">
              {Math.round(AVAILABLE_FUEL * 11).toLocaleString()}
            </span>{" "}
            <span>kilometros</span>
          </p>
        </div>
      </div>
    </div>
  );
};
