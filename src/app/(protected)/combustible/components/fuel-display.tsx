"use client";

import { Fuel } from "lucide-react";
import { useFuelStore } from "@/stores/fuelStore";

export default function FuelDisplay() {
  const availableFuel = useFuelStore((state) => state.available);

  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-6 border border-blue-200">
      <div className="text-center">
        <div className="mb-3 text-sm font-medium text-blue-700">
          Disponible Actualmente
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Fuel className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-blue-600">
              {availableFuel}
            </span>
            <span className="text-lg font-medium text-blue-700">gal</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-blue-600">
          Galones de combustible disponibles
        </div>
      </div>
    </div>
  );
}
