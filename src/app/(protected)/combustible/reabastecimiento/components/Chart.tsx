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
        label: "Galones",
        data: gallons,
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#3b82f6",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context: any) {
              return `${context.parsed.y} galones`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
            },
          },
        },
        y: {
          grid: {
            color: "#f3f4f6",
          },
          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
            },
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={config.data} options={config.options} />
    </div>
  );
}
