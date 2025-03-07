// app/combustible/reabastecimiento/page.tsx
import { Suspense } from "react";
import ReplenishmentTable from "./components/replenishment-table";
import ReplenishmentChart from "./components/replenishment-chart";
import {
  ReplenishmentChartSkeleton,
  ReplenishmentTableSkeleton,
} from "./components/skeletons";
import ReplenishmentForm from "./components/replenishment-form";

export default function ReplenishmentPage() {
  return (
    <div className="container mx-auto py-6">
      <div>
        <div className="flex justify-between  xl:flex-row xl:gap-x-5">
          <div className="w-[60%] xl:w-1/2 mt-3">
            <Suspense fallback={<ReplenishmentTableSkeleton />}>
              <ReplenishmentTable />
            </Suspense>
          </div>
          <ReplenishmentForm />
        </div>
        <div className="max-w-[650px] mt-10 mx-auto xl:mx-0">
          <Suspense fallback={<ReplenishmentChartSkeleton />}>
            <ReplenishmentChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
