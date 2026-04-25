"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import ActionDropdown from "../../components/Section/UI/ActionDropdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // UPDATE
  const updateRole = (id) => {
    router.push(`/admin/category/${id}/edit`);
  };

  // VIEW
  const viewRole = (id) => {
    router.push(`/admin/category/${id}`);
  };

  // FETCH
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/category");
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    const original = [...categories];

    setCategories((prev) =>
      prev.filter((c) => c._id !== id)
    );

    try {
      await API.delete(`/category/${id}`);
      toast.success("Category deleted successfully");
    } catch (err) {
      setCategories(original);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // TABLE ROWS (with index)
  const desktopRows = useMemo(
    () =>
      categories.map((cat, index) => (
        <tr
          key={cat._id}
          className="bg-white hover:bg-gray-50 transition border-b border-gray-100"
        >
          {/* SERIAL NO */}
          <td className="px-6 py-4 text-gray-600">
            {index + 1}
          </td>

          {/* NAME */}
          <td className="px-6 py-4 text-gray-800 font-medium">
            {cat.name}
          </td>

          {/* CREATED */}
          <td className="px-6 py-4 text-gray-500 text-sm">
            {new Date(cat.createdAt).toLocaleString()}
          </td>

          {/* ACTION */}
          <td className="px-6 py-4 text-center">
            <ActionDropdown
              onUpdate={() => updateRole(cat._id)}
              onView={() => viewRole(cat._id)}
              onDelete={() => handleDelete(cat._id)}
            />
          </td>
        </tr>
      )),
    [categories]
  );

  return (
    <div>
      {/* LOADING */}
      {loading && (
        <p className="flex items-center gap-2 text-gray-500">
          <AccessTimeIcon fontSize="small" /> Loading categories...
        </p>
      )}

      {/* EMPTY */}
      {categories.length === 0 && !loading ? (
        <div className="text-center py-10 text-gray-400">
          No categories found
        </div>
      ) : (
        <div className="overflow-visible rounded-2xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">
                  #
                </th>

                <th className="px-6 py-4 text-left text-gray-600">
                  Category Name
                </th>

                <th className="px-6 py-4 text-left text-gray-600">
                  Created At
                </th>

                <th className="px-6 py-4 text-center text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>{desktopRows}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryList;