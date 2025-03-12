"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-7 w-7"
            >
              <Link href="/activos">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h2 className="text-2xl font-semibold tracking-tight">Vehículos</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Gestiona la flota de vehículos de la empresa
          </p>
        </div>
      </div>
      <Separator />
      {children}
    </div>
  );
}