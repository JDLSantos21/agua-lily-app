"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";
import NewEquipmentModal from "./components/new-equipment-modal";
import NewEquipmentModelModal from "./components/new-equipment-model-modal";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild className="h-9 w-9 p-0">
              <Link href="/activos">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Equipos
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Control y administración de la flota de equipos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <NewEquipmentModelModal />
                <NewEquipmentModal />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
