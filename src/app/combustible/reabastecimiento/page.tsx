// app/combustible/reabastecimiento/page.tsx
import { Suspense } from "react";
import ReplenishmentTable from "./components/replenishment-table";
import ReplenishmentChart from "./components/replenishment-chart";
import {
  ReplenishmentChartSkeleton,
  ReplenishmentTableSkeleton,
} from "./components/skeletons";

export default function ReplenishmentPage() {
  return (
    <div className="mx-auto">
      <div>
        <div className="flex justify-between xl:flex-row xl:gap-x-5">
          <div className="w-full xl:w-4/6">
            <Suspense fallback={<ReplenishmentTableSkeleton />}>
              <ReplenishmentTable />
            </Suspense>
          </div>
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
