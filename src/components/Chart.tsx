import { LineChart } from "@mui/x-charts/LineChart";
import { Indices } from "../types";
import { useEffect, useState } from "react";

const formatLargeNumber = (value: number): string => {
  if (value >= 10000) {
    const exponent = Math.floor(Math.log10(value));
    return `10^${exponent}`;
  }
  return value.toString();
};
const Chart = ({ indices }: { indices: Indices[] }) => {
  const xAxisData = indices.map((pair) => pair[0]);
  const yAxisData = indices.map((pair) => pair[1]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getChartWidth = () => {
    if (isMobile) {
      return 400;
    }
    return 500;
  };

  const getChartHeight = () => {
    if (isMobile) {
      return 400;
    }
    return 600;
  };

  return (
    <LineChart
      sx={{
        //change left yAxis label styles
        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
          strokeWidth: 1,
          fill: "#fff",
        },
        // change all labels fontFamily shown on both xAxis and yAxis
        "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
          fontFamily: "Poppins",
        },
        // change bottom label styles
        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
          strokeWidth: "1",
          fill: "#fff",
        },
        // bottomAxis Line Styles
        "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
          stroke: "#fff",
          strokeWidth: 1,
        },
        // leftAxis Line Styles
        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
          stroke: "#fff",
          strokeWidth: 1,
        },
      }}
      slotProps={{
        legend: {
          labelStyle: {
            fill: "#fff",
            fontFamily: "Poppins",
          },
        },
      }}
      yAxis={[
        {
          id: "left",
          scaleType: "linear",
          valueFormatter: (value) => formatLargeNumber(value),
        },
      ]}
      colors={["#00FF00"]}
      className=""
      xAxis={[
        {
          data: xAxisData,
          label: "Size of Input",
          labelStyle: {
            fill: "#fff",
            fontFamily: "Poppins",
          },
        },
      ]}
      series={[
        {
          data: yAxisData,
          label: "Number of Iterations",
        },
      ]}
      width={getChartWidth()}
      height={getChartHeight()}
    />
  );
};

export default Chart;
