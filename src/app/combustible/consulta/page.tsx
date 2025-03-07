// app/combustible/consulta/page.tsx
import { Suspense } from "react";
import FuelQueryForm from "./components/fuel-query-form";
import FuelQuerySkeleton from "./components/fuel-query-skeleton";

export default function FuelQueryPage() {
  return (
    <div className="container mx-auto">
      <Suspense fallback={<FuelQuerySkeleton />}>
        <FuelQueryForm />
      </Suspense>
    </div>
  );
}
