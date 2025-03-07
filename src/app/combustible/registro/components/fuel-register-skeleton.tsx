"use client";

export default function FuelRegisterSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulario Skeleton */}
      <div className="border rounded p-6 space-y-4">
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-10 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Último Registro Skeleton */}
      <div className="border rounded p-6 h-[196px]">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="w-48 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="w-48 h-4 bg-gray-300 rounded animate-pulse" />
          <div className="w-48 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
