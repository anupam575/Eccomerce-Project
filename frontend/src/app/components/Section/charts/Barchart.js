"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Triangle shape
const getPath = (x, y, width, height) =>
  `M${x},${y + height}
   C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
   ${x + width / 2}, ${y}
   C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height}
   ${x + width}, ${y + height}
   Z`;

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  if (x == null || y == null) return null;

  return (
    <path
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      fill={fill}
    />
  );
};

export default function CustomShapeBarChart({
  data = [],
  barColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
  shape = TriangleBar,
  dataKey = "value",
}) {
  if (!data.length) {
    return <p className="text-sm text-gray-500">No data available</p>;
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis width="auto" />

          <Tooltip />

          <Legend />

          <Bar
            dataKey={dataKey}
            shape={shape}
            label={{ position: "top" }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[index % barColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}