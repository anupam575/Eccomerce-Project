"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "../../utils/axiosInstance";
import { format } from "date-fns";
import socket from "../../utils/socket";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- FETCH ----------------
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/orders/me");
      setOrders(res.data.orders || []);
    } catch (err) {
      setError("Failed to fetch your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!socket) return;

    const listener = (data) => {
      if (!Array.isArray(data)) return;

      setOrders((prev) => {
        const map = new Map(
          data.map((o) => [
            String(o.orderId),
            o.orderStatus,
          ])
        );

        return prev.map((order) => {
          const updatedStatus = map.get(String(order._id));

          if (!updatedStatus) return order;

          return {
            ...order,
            orderStatus: updatedStatus, // 🔥 FORCE NEW OBJECT
          };
        });
      });
    };

    socket.on("orderUpdated", listener);

    return () => socket.off("orderUpdated", listener);
  }, []);

  // ---------------- STATUS UI ----------------
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    }
  };

  // ---------------- UI ----------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-lg font-medium">
        Loading...
      </div>
    );

  if (error)
    return <div className="text-center text-red-500">{error}</div>;

  if (!orders.length)
    return <div className="text-center text-gray-500">No orders found</div>;

  return (
    <div className="p-2 -mt-16 mx-auto">

      <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold">My Orders</h1>
        
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table className="w-full border-collapse">

          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {orders.map((order) => (
              <tr
                key={order._id + order.orderStatus} // 🔥 IMPORTANT FIX
                className="hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 border">{order._id}</td>

                <td className="px-4 py-3 border">
                  {format(new Date(order.createdAt), "dd/MM/yyyy")}
                </td>

                <td className="px-4 py-3 border">
                  {currencyFormatter.format(order.totalPrice)}
                </td>

                <td className="px-4 py-3 border">
                  {order.paymentInfo?.status || "N/A"}
                </td>

                <td className="px-4 py-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td className="px-4 py-3 border text-center">
                  <Link
                    href={`/my-orders/${order._id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;