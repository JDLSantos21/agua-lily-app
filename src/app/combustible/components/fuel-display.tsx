"use client";

import { Fuel } from "lucide-react";
import { useFuelStore } from "@/stores/fuelStore";

export default function FuelDisplay() {
  const availableFuel = useFuelStore((state) => state.available);

  return (
    <div className="rounded-lg bg-slate-100 p-6 text-center">
      <div className="mb-2 text-sm font-medium text-slate-500">
        Disponible Actualmente
      </div>
      <div className="flex items-center justify-center gap-2">
        <Fuel className="h-6 w-6 text-blue-500" />
        <span className="text-3xl font-bold text-blue-500">
          {availableFuel}
        </span>
        <span className="text-lg font-medium text-slate-700">Galones</span>
      </div>
    </div>
  );
}
