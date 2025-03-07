import { fetchReplenishmentChartData } from "@/api/fuel";
import Chart from "./Chart";

export default async function ReplenishmentChartCom() {
  const chartData: {
    month: string;
    total_gallons: string;
  }[] = await fetchReplenishmentChartData();

  return (
    <div>
      <Chart chartData={chartData} />
    </div>
  );
}
