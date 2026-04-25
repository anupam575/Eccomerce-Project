"use client";

import React from "react";

const BulkSelectionTable = ({
  data = [],
  selected = [],
  setSelected,
  renderRow,
}) => {

  // ✅ TOGGLE SINGLE
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ✅ SELECT ALL
  const toggleSelectAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((item) => item._id));
    }
  };

  return (
    <table className="w-full text-sm border-collapse">

      {/* HEADER */}
      <thead className="bg-gray-50 text-gray-700">
        <tr>
          <th className="px-4 py-3 border">
            <input
              type="checkbox"
              checked={
                selected.length === data.length && data.length > 0
              }
              onChange={toggleSelectAll}
            />
          </th>

          {/* CUSTOM HEADERS FROM PARENT */}
          {renderRow("head")}
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item._id}
            className={`${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } hover:bg-gray-100`}
          >
            {/* CHECKBOX */}
            <td className="px-4 py-3 border">
              <input
                type="checkbox"
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
              />
            </td>

            {/* CUSTOM ROW */}
            {renderRow("body", item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BulkSelectionTable;

















"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

// UI
import ActionDropdown from "../../components/Section/UI/ActionDropdown";
import AlertDialogModal from "../../components/Section/UI/AlertDialogModal";
import BulkSelectionTable from "../../components/Section/UI/BulkSelectionTable";

// Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminOrdersPanel = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

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

  // ✅ SINGLE DELETE
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

  // ✅ BULK DELETE
  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      return toast.warning("Select orders first");
    }

    const original = [...orders];

    setOrders((prev) =>
      prev.filter((o) => !selectedOrders.includes(o._id))
    );

    try {
      await API.delete(`/admin/orders`, {
        data: { orderIds: selectedOrders },
      });

      toast.success("Bulk delete successful");
      setSelectedOrders([]);
    } catch {
      setOrders(original);
      toast.error("Bulk delete failed");
    }
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

  // ✅ TABLE RENDER FUNCTION (IMPORTANT)
  const renderRow = (type, o) => {
    if (type === "head") {
      return (
        <>
          <th className="px-4 py-3 border text-left">Order ID</th>
          <th className="px-4 py-3 border text-left">User</th>
          <th className="px-4 py-3 border text-center">Amount</th>
          <th className="px-4 py-3 border text-center">Status</th>
          <th className="px-4 py-3 border text-center">Created</th>
          <th className="px-4 py-3 border text-center">Actions</th>
        </>
      );
    }

    return (
      <>
        <td className="px-4 py-3 border text-sm">{o._id}</td>

        <td className="px-4 py-3 border">
          <div className="font-medium">{o.user?.name}</div>
          <div className="text-xs text-gray-500">
            {o.user?.email}
          </div>
        </td>

        <td className="px-4 py-3 border text-center text-green-600 font-semibold">
          ₹{o.totalPrice}
        </td>

        <td className="px-4 py-3 border text-center">
          <span className={getStatusBadge(o.orderStatus)}>
            {o.orderStatus}
          </span>
        </td>

        <td className="px-4 py-3 border text-center text-gray-500">
          {new Date(o.createdAt).toLocaleDateString()}
        </td>

        <td className="px-4 py-3 border text-center">
          <ActionDropdown
            onView={() => handleView(o._id)}
            onUpdate={() => handleUpdate(o._id)}
            onDelete={() => handleDelete(o._id)}
          />
        </td>
      </>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="bg-white rounded-xl shadow-md border">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <InventoryIcon />
            <h2 className="text-lg font-semibold">
              Admin Orders Panel
            </h2>
          </div>

          {/* BULK DELETE */}
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded flex gap-2"
          >
            <DeleteIcon fontSize="small" />
            Delete Selected
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="p-6 flex gap-2 text-gray-500">
            <AccessTimeIcon /> Loading...
          </p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-gray-500">No orders found.</p>
        ) : (
          <BulkSelectionTable
            data={orders}
            selected={selectedOrders}
            setSelected={setSelectedOrders}
            renderRow={renderRow}
          />
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