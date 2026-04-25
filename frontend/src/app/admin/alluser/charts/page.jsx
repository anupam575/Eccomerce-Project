"use client";

import { useEffect, useState } from "react";
import API from "../../../../utils/axiosInstance";

// Charts
import CustomShapeBarChart from "../../../components/Section/charts/Barchart";
import PieChartWithCustomizedLabel from "../../../components/Section/charts/Piechart";
import CustomizedDotLineChart from "../../../components/Section/charts/Linechart";

export default function UserChartsPage() {
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await API.get("/admin/users/active");

      const users = data?.users || [];
      const totalUsers = data?.totalUsers ?? users.length;

      const currentUserCount = users.filter(u => u.currentUser).length;
      const otherActiveUsers = users.filter(
        u => u.isActive && !u.currentUser
      ).length;

      // ✅ DRY base data
      const baseData = [
        { name: "Total Users", value: totalUsers },
        { name: "Current User", value: currentUserCount },
        { name: "Other Active Users", value: otherActiveUsers },
      ];

      // ✅ Set states
      setChartData(baseData);
      setPieData(baseData);

      setLineData(
        baseData.map(item => ({
          ...item,
          uv: item.value,
          pv: item.value,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load user analytics");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading charts...
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
    <div className="p-6 md:p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Users Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PIE */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center min-h-[350px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            User Distribution
          </h2>
          <PieChartWithCustomizedLabel data={pieData} />
        </div>

        {/* BAR */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center min-h-[350px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            User Activity
          </h2>
          <CustomShapeBarChart data={chartData} />
        </div>

        {/* LINE */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center md:col-span-2 min-h-[350px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            User Trends
          </h2>
          <CustomizedDotLineChart data={lineData} />
        </div>

      </div>
    </div>
  );
}