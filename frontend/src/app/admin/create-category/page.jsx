"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import CategoryList from "../../components/section/Allcategory";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ regex (only letters + space)
  const nameRegex = /^[A-Za-z\s]*$/;

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const value = e.target.value;

    // ❌ block special chars & numbers
    if (!nameRegex.test(value)) {
      setError("Only letters and spaces allowed");
      return;
    }

    setName(value);

    // ✅ live validation
    if (!value.trim()) {
      setError("Category name is required");
    } else {
      setError("");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      toast.warn("Category name is required");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(trimmed)) {
      toast.error("Only letters and spaces allowed");
      return;
    }

    try {
      setLoading(true);

      await API.post("/category/create", {
        name: trimmed,
      });

      toast.success("Category created successfully 🎉");

      setName("");
      setError("");
      setRefreshKey((prev) => prev + 1);

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Category Management
        </h2>
        <p className="text-sm text-gray-500">
          Create and manage categories
        </p>
      </div>

      {/* INPUT CARD */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">

        <form onSubmit={handleSubmit} className="flex gap-3">

          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 rounded-lg bg-gray-50 border
                ${error ? "border-red-500" : "border-gray-200"}
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
            />

            {/* ✅ Error message */}
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !!error}
            className={`
              bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg 
              transition shadow-sm
              ${loading || error ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Creating..." : "Create"}
          </button>

        </form>
      </div>

      {/* LIST */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <CategoryList key={refreshKey} />
      </div>

    </div>
  );
};

export default CreateCategory;