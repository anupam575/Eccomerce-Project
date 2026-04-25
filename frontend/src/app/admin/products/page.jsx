"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

// UI Components
import ActionDropdown from "../../components/Section/UI/ActionDropdown";
import AlertDialogModal from "../../components/Section/UI/AlertDialogModal";

// MUI Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AdminProductsPanel = () => {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 DELETE STATE (IMPORTANT)
  const [deleteProductId, setDeleteProductId] = useState(null);

  // ✅ Fetch Products
  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load products";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // ✅ NAVIGATION
  const handleUpdate = (id) => {
    router.push(`/admin/products/${id}`);
  };

  const handleView = (id) => {
    router.push(`/admin/products/${id}`);
  };

  // 🔥 DELETE CLICK → OPEN MODAL
  const handleDelete = (id) => {
    setDeleteProductId(id);
  };

  // 🔥 CONFIRM DELETE → API CALL
  const confirmDelete = async () => {
    if (!deleteProductId) return;

    const original = [...products];

    // Optimistic UI
    setProducts((prev) =>
      prev.filter((p) => p._id !== deleteProductId)
    );

    try {
      await API.delete(`/admin/product/${deleteProductId}`);
      toast.success("Product deleted successfully");
    } catch (err) {
      setProducts(original); // rollback
      toast.error("Failed to delete product");
    }

    setDeleteProductId(null);
  };

  // ✅ TABLE ROWS
  const tableRows = useMemo(
    () =>
      products.map((p, index) => (
        <tr
          key={p._id}
          className={`border-b border-gray-700 ${
            index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
          } hover:bg-gray-700 transition`}
        >
          <td className="px-6 py-4 border-r border-gray-600 text-gray-200">
            {p._id}
          </td>

          <td className="px-6 py-4 border-r border-gray-600 text-gray-200">
            {p.name}
          </td>

          <td className="px-6 py-4 border-r border-gray-600 text-green-400 font-semibold text-center">
            ₹{p.price}
          </td>

          <td className="px-6 py-4 border-r border-gray-600 text-yellow-300 text-center">
            {p.stock}
          </td>

          {/* CREATED DATE */}
          <td className="px-6 py-4 border-r border-gray-600 text-gray-400 text-center">
            {new Date(p.createdAt).toLocaleDateString()}
          </td>

          {/* ACTION DROPDOWN */}
          <td className="px-6 py-4 text-center">
            <ActionDropdown
              onUpdate={() => handleUpdate(p._id)}
              onView={() => handleView(p._id)}
              onDelete={() => handleDelete(p._id)}
            />
          </td>
        </tr>
      )),
    [products]
  );

  return (
    <div className=" bg-gray-900 border border-gray-700 text-white">

      {/* HEADER */}
      <div className="flex items-center gap-2 p-5 border-b border-gray-700 bg-gray-800">
        <InventoryIcon className="text-yellow-400" />
        <h2 className="text-lg font-semibold">Admin Products Panel</h2>
      </div>

      {/* STATES */}
      {loading ? (
        <p className="p-6 flex items-center gap-2 text-gray-400">
          <AccessTimeIcon fontSize="small" /> Loading products...
        </p>
      ) : error ? (
        <p className="p-6 text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="p-6 text-gray-400">No products found.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-800 text-gray-200 border-b border-gray-600">
            <tr>
              <th className="px-6 py-3 border-r">Product ID</th>
              <th className="px-6 py-3 border-r">Name</th>
              <th className="px-6 py-3 border-r">Price</th>
              <th className="px-6 py-3 border-r">Stock</th>
              <th className="px-6 py-3 border-r">Created</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>{tableRows}</tbody>
        </table>
      )}

      {/* 🔥 DELETE MODAL */}
      <AlertDialogModal
        open={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this product?"
        confirmText="Delete"
      />
    </div>
  );
};

export default AdminProductsPanel;