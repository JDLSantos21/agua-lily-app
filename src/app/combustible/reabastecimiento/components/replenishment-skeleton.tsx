// app/combustible/reabastecimiento/components/replenishment-skeleton.tsx
export default function ReplenishmentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}
