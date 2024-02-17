import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js/auto";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function RevenueChart() {
    const [revenueByMonth, setRevenueByMonth] = useState({})
    useEffect(() => {
        axios
          .get("http://localhost:3000/order/total/revenue-per-month")
          .then((response) => {
            if (response.data) {
                setRevenueByMonth(response?.data?.revenueByMonth);
            }
          })
          .catch((error) => {
            console.error("Error fetching orders:", error);
          })
         
      }, []);
  const smooth = true; // Set to true for smooth tension, false for no tension
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue",
        },
      },
    },
    elements: {
      line: {
        tension: smooth ? 0.5 : 0,
      },
    },
  };
  const labels = Object.keys(revenueByMonth);
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Revenue",
        data: Object.values(revenueByMonth),
        backgroundColor: "rgba(0, 113, 69, .2)",
        borderColor: "rgba(0, 113, 69, 1)",
        borderWidth: 1,
        pointRadius: 3,
        pointHitRadius: 3,
        pointBorderColor: "rgba(0, 113, 69, 1)",
        pointBackgroundColor: "rgba(0, 113, 69, 1)",
      },
    ],
  };

  return <Line options={options} data={data} className="w-full"/>;
}
