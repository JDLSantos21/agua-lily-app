// app/combustible/consulta/components/fuel-query-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function FuelQuerySkeleton() {
  return (
    <div className="space-y-6">
      {/* Filtros skeleton */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-24" />
            <Skeleton className="h-11 w-20" />
          </div>
        </div>
      </div>

      {/* Tabla skeleton */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-8">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
