"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

// ---------------- STATUS FLOW ----------------
export const allowedTransitions = {
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Soon", "Cancelled"],
  Soon: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export default function useOrdersStatus() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [rowStatus, setRowStatus] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH ----------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/orders");
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- UPDATE ----------------
  const updateStatus = async (orderIds, status) => {
    if (!status) return toast.error("Select status first");

    try {
      await API.put("/admin/orders/update-status", {
        orderIds,
        status,
      });

      toast.success("Updated Successfully 🔥");
      setSelected([]);
      setBulkStatus("");
      setRowStatus({});
      fetchOrders();
    } catch {
      toast.error("Update failed");
    }
  };

  // ---------------- SELECT ----------------
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((o) => o._id));
    }
  };

  // ---------------- ROW STATUS ----------------
  const handleRowStatusChange = (id, value) => {
    setRowStatus((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ---------------- BULK OPTIONS ----------------
  const getBulkOptions = () => {
    const statuses = new Set();

    selected.forEach((id) => {
      const order = orders.find((o) => o._id === id);
      if (!order) return;

      allowedTransitions[order.orderStatus]?.forEach((st) => {
        statuses.add(st);
      });
    });

    return [...statuses];
  };

  return {
    orders,
    selected,
    bulkStatus,
    setBulkStatus,
    loading,
    rowStatus,
    allowedTransitions,
    toggleSelect,
    toggleSelectAll,
    updateStatus,
    handleRowStatusChange,
    getBulkOptions,
  };
}