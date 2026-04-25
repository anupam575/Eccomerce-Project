"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../../../utils/axiosInstance";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RoleManager = () => {
  const { id } = useParams();
  const router = useRouter();

  const [roleName, setRoleName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

  // ================= FETCH =================
  const fetchRole = async () => {
    try {
      setFetching(true);

      const res = await API.get(`/roles/${id}`);

      if (res.data.success) {
        const name = res.data.role.role_name;
        setRoleName(name);
        setOriginalName(name);
      }
    } catch (err) {
      toast.error("Failed to fetch role");
      router.push("/admin/role");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchRole();
  }, [id]);

  // ================= INPUT =================
  const handleChange = (e) => {
    const value = e.target.value;

    if (value && !/^[A-Za-z\s]*$/.test(value)) {
      setError("Only letters and spaces allowed");
      return;
    }

    setRoleName(value);

    if (!value.trim()) {
      setError("Role name is required");
    } else if (!nameRegex.test(value.trim())) {
      setError("Invalid format (no extra spaces)");
    } else if (value.trim() === originalName) {
      setError("New name must be different");
    } else {
      setError("");
    }
  };

  // ================= UPDATE =================
  const updateRole = async () => {
    const trimmed = roleName.trim();

    if (!trimmed) return toast.warn("Role name is required");
    if (!nameRegex.test(trimmed))
      return toast.error("Only letters and single spaces allowed");
    if (trimmed === originalName)
      return toast.warn("No changes detected");

    try {
      setLoading(true);

      const res = await API.put(`/roles/${id}`, {
        role_name: trimmed,
      });

      if (res.data.success) {
        toast.success("Role updated successfully 🎉");
        router.push("/admin/role");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">

      {/* CARD */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Update Role
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Modify role name
          </p>
        </div>

        {/* LOADING */}
        {fetching ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <AccessTimeIcon className="mr-2" />
            Loading...
          </div>
        ) : (
          <>
            {/* INPUT */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Role Name
              </label>

              <input
                type="text"
                value={roleName}
                onChange={handleChange}
                placeholder="Enter role name"
                className={`
                  w-full px-4 py-3 rounded-xl border
                  ${error ? "border-red-500" : "border-gray-200"}
                  bg-gray-50 focus:bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition
                `}
              />

              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={updateRole}
                disabled={loading || !!error}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update"}
              </button>

              <button
                onClick={() => router.push("/admin/role")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition"
              >
                Cancel
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoleManager;