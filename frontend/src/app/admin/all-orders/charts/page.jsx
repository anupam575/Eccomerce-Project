"use client";

import { useEffect, useState } from "react";
import API from "../../../../utils/axiosInstance";

// Charts
import CustomShapeBarChart from "../../../components/Section/charts/Barchart";
import PieChartWithCustomizedLabel from "../../../components/Section/charts/Piechart";
import CustomizedDotLineChart from "../../../components/Section/charts/Linechart";

export default function OrdersChartPage() {
  const [baseData, setBaseData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await API.get("/admin/orders?limit=500");

      const orders = data?.orders ?? [];

      const processing = orders.filter(
        (o) => o?.orderStatus === "Processing"
      ).length;

      const soon = orders.filter(
        (o) => o?.orderStatus === "Soon"
      ).length;

      const total = processing + soon;

      // ✅ DRY base data
      const formatted = [
        { name: "Processing", value: processing },
        { name: "Soon", value: soon },
        { name: "Total Orders", value: total },
      ];

      setBaseData(formatted);

      // ✅ Line data
      setLineData(
        formatted.map((item) => ({
          ...item,
          pv: item.value,
          uv: item.value,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load order analytics");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading orders analytics...
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Orders Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PIE */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center min-h-[350px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Orders Distribution
          </h3>
          <PieChartWithCustomizedLabel data={baseData} />
        </div>

        {/* BAR */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center min-h-[350px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Orders Status (Bar Chart)
          </h3>
          <CustomShapeBarChart data={baseData} />
        </div>

        {/* LINE */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center md:col-span-2 min-h-[350px]">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Orders Trend (Line Chart)
          </h3>
          <CustomizedDotLineChart data={lineData} />
        </div>

      </div>
    </div>
  );
}