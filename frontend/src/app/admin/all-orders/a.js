"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

// UI
import ActionDropdown from "../../components/Section/UI/ActionDropdown";
import AlertDialogModal from "../../components/Section/UI/AlertDialogModal";

// Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AdminOrdersPanel = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ FETCH
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(
        `/admin/orders?page=${page}&limit=${limit}`
      );
      setOrders(data.orders || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  // ✅ ACTIONS
  const handleView = (id) => router.push(`/admin/orders/${id}`);
  const handleUpdate = (id) => router.push(`/admin/orders/edit/${id}`);
  const handleDelete = (id) => setDeleteOrderId(id);

  // ✅ DELETE CONFIRM
  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    const original = [...orders];
    setOrders((prev) => prev.filter((o) => o._id !== deleteOrderId));

    try {
      await API.delete(`/admin/orders`, {
        data: { orderIds: [deleteOrderId] },
      });
      toast.success("Order deleted successfully");
    } catch {
      setOrders(original);
      toast.error("Failed to delete order");
    }

    setDeleteOrderId(null);
  };

  // ✅ STATUS BADGE
  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "Delivered":
        return `${base} bg-green-100 text-green-700`;
      case "Shipped":
        return `${base} bg-blue-100 text-blue-700`;
      case "Processing":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "Cancelled":
        return `${base} bg-red-100 text-red-600`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  };

  // ✅ ROWS
  const tableRows = useMemo(
    () =>
      orders.map((o, index) => (
        <tr
          key={o._id}
          className={`${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          } hover:bg-gray-100 transition`}
        >
          <td className="px-4 py-3 border border-gray-200 text-sm text-gray-700">
            {o._id}
          </td>

          <td className="px-4 py-3 border border-gray-200">
            <div className="font-medium text-gray-800">
              {o.user?.name || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {o.user?.email}
            </div>
          </td>

          <td className="px-4 py-3 border border-gray-200 text-center font-semibold text-green-600">
            ₹{o.totalPrice}
          </td>

          <td className="px-4 py-3 border border-gray-200 text-center">
            <span className={getStatusBadge(o.orderStatus)}>
              {o.orderStatus}
            </span>
          </td>

          <td className="px-4 py-3 border border-gray-200 text-center text-gray-500">
            {new Date(o.createdAt).toLocaleDateString()}
          </td>

          <td className="px-4 py-3 border border-gray-200 text-center">
            <ActionDropdown
              onView={() => handleView(o._id)}
              onUpdate={() => handleUpdate(o._id)}
              onDelete={() => handleDelete(o._id)}
            />
          </td>
        </tr>
      )),
    [orders]
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* CARD CONTAINER */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">

        {/* HEADER */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <InventoryIcon className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">
            Admin Orders Panel
          </h2>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="p-6 flex gap-2 text-gray-500">
            <AccessTimeIcon /> Loading orders...
          </p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full text-sm border-collapse">

            {/* HEADER */}
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 border border-gray-200 text-left">Order ID</th>
                <th className="px-4 py-3 border border-gray-200 text-left">User</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Amount</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Status</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Created</th>
                <th className="px-4 py-3 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>{tableRows}</tbody>
          </table>
        )}
      </div>

      {/* DELETE MODAL */}
      <AlertDialogModal
        open={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this order?"
      />
       
    </div>
  );
};

export default AdminOrdersPanel;