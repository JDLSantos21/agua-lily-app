// app/combustible/consulta/page.tsx
import { Suspense } from "react";
import FuelQueryForm from "./components/fuel-query-form";
import FuelQuerySkeleton from "./components/fuel-query-skeleton";

export default function FuelQueryPage() {
  return (
    <div>
      <div className="bg-white rounded-lg">
        <div className="pb-6">
          <Suspense fallback={<FuelQuerySkeleton />}>
            <FuelQueryForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
