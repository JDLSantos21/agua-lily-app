// app/combustible/consulta/components/fuel-query-skeleton.tsx
export default function FuelQuerySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        <div className="w-24 h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-32"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}
