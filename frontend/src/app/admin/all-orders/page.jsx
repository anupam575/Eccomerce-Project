"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import BulkSelectionTable from "../../components/Section/BulkDelete";
import ActionDropdown from "../../components/Section/UI/ActionDropdown";
import AlertDialogModal from "../../components/Section/UI/AlertDialogModal";
import UIPagination from "../../components/Section/UI/UIPagination";

import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AdminOrdersPanel = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState("");
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  // ✅ DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ FETCH ORDERS (WITH SEARCH)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = "";

      if (debouncedQuery.trim()) {
        // 🔥 BEST: use orders search API (NOT users)
        url = `/admin/orders/search?query=${debouncedQuery}&page=${page}&limit=${limit}`;
      } else {
        url = `/admin/orders?page=${page}&limit=${limit}`;
      }

      const { data } = await API.get(url);

      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalOrders(data.totalOrders || 0);

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH ON PAGE + SEARCH
  useEffect(() => {
    fetchOrders();
  }, [page, debouncedQuery]);

  // ✅ RESET PAGE ON SEARCH
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // ACTIONS
  const handleView = (id) => router.push(`/admin/all-orders/${id}`);
  const handleUpdate = (id) => router.push(`/admin/all-orders/edit/${id}`);
  const handleDelete = (id) => setDeleteOrderId(id);

  // DELETE SINGLE
  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    const original = [...orders];
    setOrders((prev) => prev.filter((o) => o._id !== deleteOrderId));

    try {
      await API.delete(`/admin/orders`, {
        data: { orderIds: [deleteOrderId] },
      });
      toast.success("Order deleted");
    } catch {
      setOrders(original);
      toast.error("Delete failed");
    }

    setDeleteOrderId(null);
  };

  // BULK DELETE
  const handleBulkDelete = async () => {
    try {
      await API.delete(`/admin/orders`, {
        data: { orderIds: selected },
      });

      setOrders((prev) =>
        prev.filter((o) => !selected.includes(o._id))
      );

      setSelected([]);
      toast.success("Deleted selected");
    } catch {
      toast.error("Bulk delete failed");
    }
  };

  // STATUS BADGE
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

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-5 border-b bg-gray-50">

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <InventoryIcon className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Orders
              </h2>
              <p className="text-xs text-gray-500">
                Manage all customer orders
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BULK BAR */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 bg-blue-50 border-b border-blue-100">
            <span className="text-sm text-blue-600 font-medium">
              {selected.length} selected
            </span>

            <button
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="p-4">

          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 p-4">
              <AccessTimeIcon />
              Loading...
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No orders found.
            </div>
          ) : (
            <BulkSelectionTable
              data={orders}
              selected={selected}
              setSelected={setSelected}
              renderRow={(type, item) => {

                if (type === "head") {
                  return (
                    <>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold text-gray-600">Order ID</th>
                      <th className="px-4 py-3 border border-gray-200 text-left font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 border border-gray-200 text-center font-semibold text-gray-600">Amount</th>
                      <th className="px-4 py-3 border border-gray-200 text-center font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 border border-gray-200 text-center font-semibold text-gray-600">Created</th>
                      <th className="px-4 py-3 border border-gray-200 text-center font-semibold text-gray-600">Actions</th>
                    </>
                  );
                }

                if (type === "body") {
                  return (
                    <>
                      <td className="px-4 py-3 border border-gray-200">{item._id}</td>

                      <td className="px-4 py-3 border border-gray-200">
                        <div className="font-medium">{item.user?.name || "N/A"}</div>
                        <div className="text-xs text-gray-500">{item.user?.email}</div>
                      </td>

                      <td className="px-4 py-3 border border-gray-200 text-center text-green-600 font-semibold">
                        ₹{item.totalPrice}
                      </td>

                      <td className="px-4 py-3 border border-gray-200 text-center">
                        <span className={getStatusBadge(item.orderStatus)}>
                          {item.orderStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3 border border-gray-200 text-center">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 border border-gray-200 text-center">
                        <ActionDropdown
                          onView={() => handleView(item._id)}
                          onUpdate={() => handleUpdate(item._id)}
                          onDelete={() => handleDelete(item._id)}
                        />
                      </td>
                    </>
                  );
                }
              }}
            />
          )}

        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6 px-2">
        <span className="text-sm text-gray-500">
          Total Orders: {totalOrders}
        </span>

        <UIPagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          shape="rounded"
        />
      </div>

      {/* MODAL */}
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