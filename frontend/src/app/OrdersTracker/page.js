"use client";
import React, { useEffect, useState } from "react";
import API from "../../utils/axiosInstance";
import socket from "../../utils/socket";

// ✅ MUI Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const OrdersTracker = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- STATUS STEPS ----------------
  const STATUS_STEPS = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED",
  ];

  // ---------------- FORMAT DATE ----------------
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  // ---------------- SAFE NORMALIZER (IMPORTANT FIX) ----------------
  const normalizeStatus = (status) =>
    (status || "")
      .toUpperCase()
      .replace(/\s+/g, "_");

  // ---------------- STEP MAPPING ----------------
  const mapStatusToStep = (status) => {
    const s = normalizeStatus(status);

    switch (s) {
      case "PLACED":
        return 0;
      case "PROCESSING":
      case "CONFIRMED":
        return 1;
      case "SHIPPED":
        return 2;
      case "SOON":
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      case "CANCELLED":
        return -1;
      default:
        return 0;
    }
  };

  // ---------------- STATUS COLORS ----------------
  const getStatusColor = (status) => {
    const s = normalizeStatus(status);

    switch (s) {
      case "DELIVERED":
        return "bg-green-100 text-green-700 border border-green-300";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "SOON":
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-700 border border-indigo-300";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    }
  };

  // ---------------- FETCH ORDERS ----------------
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/orders/me");

      const normalizedOrders = (res.data.orders || []).map((o) => ({
        ...o,
        orderStatus: normalizeStatus(o.orderStatus || o.status),
      }));

      setOrders(normalizedOrders);
    } catch (err) {
      setError("Failed to fetch your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- SOCKET LISTENER (FULL FIXED) ----------------
  useEffect(() => {
    if (!socket) return;

    const listener = (data) => {
      if (!Array.isArray(data)) return;

      setOrders((prevOrders) => {
        const updatedMap = new Map(
          data.map((o) => [
            String(o.orderId),
            {
              ...o,
              orderStatus: normalizeStatus(o.orderStatus),
            },
          ])
        );

        return prevOrders.map((order) => {
          const updated = updatedMap.get(String(order._id));

          if (!updated) return order;

          return {
            ...order,
            orderStatus: updated.orderStatus,
            shippedAt: updated.shippedAt ?? order.shippedAt,
            soonAt: updated.soonAt ?? order.soonAt,
            deliveredAt: updated.deliveredAt ?? order.deliveredAt,
          };
        });
      });
    };

    socket.on("orderUpdated", listener);

    return () => {
      socket.off("orderUpdated", listener);
    };
  }, []);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-5xl mx-auto">
      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {orders.map((order) => {
        const currentStep = mapStatusToStep(order.orderStatus);
        const isCancelled =
          normalizeStatus(order.orderStatus) === "CANCELLED";

        return (
          <div
            key={order._id}
            className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl p-6 mb-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ShoppingCartIcon fontSize="small" />
                  {order?.items?.[0]?.name || "Order"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Order ID: {order._id}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ₹{order.totalPrice}
                </p>

                <span
                  className={`mt-1 inline-block text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* STEPPER */}
            <div className="flex items-center justify-between mt-8 relative">
              {STATUS_STEPS.map((step, index) => {
                const isActive = index <= currentStep;

                return (
                  <div
                    key={step}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {index !== 0 && (
                      <div
                        className={`absolute top-3 left-[-50%] w-full h-[3px] rounded-full
                        ${
                          isCancelled
                            ? "bg-red-400"
                            : isActive
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center z-10 shadow-md
                      ${
                        isCancelled
                          ? "bg-red-500 text-white"
                          : isActive
                          ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCancelled ? (
                        <CancelIcon fontSize="small" />
                      ) : isActive ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      )}
                    </div>

                    <p
                      className={`text-[11px] mt-2 text-center font-medium
                      ${
                        isActive
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* TIMELINE */}
            <div className="mt-6 border-t pt-4 text-xs text-gray-600 space-y-2">
              {order.shippedAt && (
                <p className="flex items-center gap-2">
                  <Inventory2Icon fontSize="small" />
                  Shipped: {formatDate(order.shippedAt)}
                </p>
              )}

              {order.soonAt && (
                <p className="flex items-center gap-2">
                  <LocalShippingIcon fontSize="small" />
                  Out for Delivery: {formatDate(order.soonAt)}
                </p>
              )}

              {order.deliveredAt && (
                <p className="flex items-center gap-2">
                  <CheckCircleIcon fontSize="small" />
                  Delivered: {formatDate(order.deliveredAt)}
                </p>
              )}
            </div>

            {/* CANCEL MESSAGE */}
            {isCancelled && (
              <div className="mt-4 flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold p-3 rounded-xl">
                <CancelIcon fontSize="small" />
                Order Cancelled
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersTracker;