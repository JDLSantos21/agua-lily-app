// app/combustible/reabastecimiento/components/replenishment-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ReplenishmentSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tabla skeleton */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="p-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>

        {/* Gráfico skeleton */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="p-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
