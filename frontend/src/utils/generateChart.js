import React from "react";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
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
  Legend
);

const ChartComponent = ({ profile }) => {
  const generateChartData = (profile) => {
    const today = dayjs();
    const last7Days = Array.from({ length: 7 })
      .map((_, index) => today.subtract(index, "day").format("YYYY-MM-DD"))
      .reverse();

    const labels = last7Days.map((date) => dayjs(date).format("MM/DD/YYYY"));
    const uploadCounts = last7Days.map(
      (date) =>
        profile.dates.find((d) => dayjs(d.date).format("YYYY-MM-DD") === date)
          ?.uploadCount || 0
    );
    const downloadCounts = last7Days.map(
      (date) =>
        profile.dates.find((d) => dayjs(d.date).format("YYYY-MM-DD") === date)
          ?.downloadCount || 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Uploads",
          data: uploadCounts,
          borderColor: "rgb(255, 163, 0)",
          backgroundColor: "rgba(255, 163, 0, 0.2)",
          fill: true,
        },
        {
          label: "Downloads",
          data: downloadCounts,
          borderColor: "rgb(155, 25, 245)",
          backgroundColor: "rgba(155, 25, 245, 0.2)",
          fill: true,
        },
      ],
    };
  };

  if (!profile) {
    return <p>Loading chart...</p>;
  }

  const chartData = generateChartData(profile);

  return (
    <div className="h-64 w-full">
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
