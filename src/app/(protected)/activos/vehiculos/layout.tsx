"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Truck } from "lucide-react";
import Link from "next/link";

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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Vehículos
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Control y administración de la flota vehicular
                </p>
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
