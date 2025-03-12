"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente que muestra un esqueleto de carga mientras se obtienen los datos iniciales
 */
export default function FuelRegisterSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulario Skeleton */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-7 w-48 mb-2" />
          
          {/* Campos del formulario skeleton */}
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          
          {/* Toggle y botón */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>

      {/* Último Registro Skeleton */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-6 w-40" />
          </div>
          
          <Skeleton className="h-5 w-32 mx-auto mb-6" />
          
          {/* Elementos de información */}
          <div className="space-y-6">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
