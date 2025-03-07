"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({
  chartData,
}: {
  chartData: {
    month: string;
    total_gallons: string;
  }[];
}) {
  if (!chartData) return null;
  const labels = chartData.map((item) => item.month);
  const gallons = chartData.map((item) => item.total_gallons);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Reabastecimientos",
        data: gallons,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "blue",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Historial de Reabastecimientos",
        },
      },
    },
  };

  return <Line data={config.data} options={config.options} />;
}
