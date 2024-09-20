import { useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpSourcesPie = () => {
  const chartRef = useRef(null);

  const data = [2500, 1630, 340, 1200];
  const labels = ["Groceries", "House", "Entertainment", "Car"];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Expenses",
        data: data,
        backgroundColor: [
          "rgb(243, 103, 19)",
          "rgb(234, 84, 53)",
          "rgb(227, 64, 87)",
          "rgb(255, 32, 139)",
        ],
        hoverBackgroundColor: [
          "rgb(263, 123, 39)",
          "rgb(254, 104, 73)",
          "rgb(247, 84, 107)",
          "rgb(275, 52, 159)",
        ],
        borderColor: "#161A40", // Make the border transparent
        borderWidth: 5, // Adjust this value for more or less spacing
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 40,
          boxHeight: 20,
          useBorderRadius: true,
          borderRadius: 5,
          padding: 10,
        },
      },
      title: {
        display: false,
        text: "Sources of Expenses",
      },
    },
  };

  return (
    <div style={{ height: "100%" }}>
      <Doughnut ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ExpSourcesPie;
