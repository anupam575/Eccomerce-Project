"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Optimized Dot (no heavy SVG)
const CustomizedDot = ({ cx, cy, value }) => {
  if (cx == null || cy == null) return null;

  const color = value > 2500 ? "red" : "green";

  return (
    <circle cx={cx} cy={cy} r={5} fill={color} />
  );
};

export default function CustomizedDotLineChart({ data = [] }) {
  if (!data.length) {
    return <p className="text-sm text-gray-500">No data available</p>;
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis width="auto" />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            dot={<CustomizedDot />}
            activeDot={{ r: 7 }}
          />

          <Line
            type="monotone"
            dataKey="uv"
            stroke="#82ca9d"
            dot={false} // cleaner UI
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}