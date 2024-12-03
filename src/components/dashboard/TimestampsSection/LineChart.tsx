import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export function LineChart({
  xLabels,
  data,
}: {
  xLabels: string[];
  data: number[];
}) {
  return (
    <Line
      className="h-full w-full max-w-full"
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { autoSkipPadding: 30 } },
        },
      }}
      data={{
        labels: xLabels,
        datasets: [
          {
            fill: true,
            label: "Visitors",
            data,
            tension: 0.3,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      }}
    />
  );
}
