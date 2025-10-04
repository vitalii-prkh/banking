"use client";

import React from "react";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = {
  accounts: Account[];
};

export function DoughnutChart(props: DoughnutChartProps) {
  const data = {
    datasets: [
      {
        label: "Banks",
        data: props.accounts.map((account) => account.currentBalance),
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
      },
    ],
    labels: props.accounts.map((account) => account.name),
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}
