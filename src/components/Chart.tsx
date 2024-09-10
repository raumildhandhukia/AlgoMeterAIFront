import { LineChart } from "@mui/x-charts/LineChart";
import { Indices } from "../types";

const Chart = ({ indices }: { indices: Indices[] }) => {
  const xAxisData = indices.map((pair) => pair[0]);
  const yAxisData = indices.map((pair) => pair[1]);
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
      colors={["#00FF00"]}
      className=""
      xAxis={[{ data: xAxisData }]}
      series={[
        {
          data: yAxisData,
        },
      ]}
      width={500}
      height={600}
    />
  );
};

export default Chart;
