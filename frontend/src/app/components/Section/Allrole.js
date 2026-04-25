"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import ActionDropdown from "../../components/Section/UI/ActionDropdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ================= FETCH =================
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await API.get("/roles/all");

      if (res.data.success) {
        setRoles(res.data.roles || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ================= NAVIGATION =================
  const updateRole = (id) => {
    router.push(`/admin/role/edit/${id}`);
  };

  const viewRole = (id) => {
    router.push(`/admin/role/${id}`);
  };

  // ================= DELETE =================
  const deleteRole = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this role?"
    );
    if (!confirmDelete) return;

    const original = [...roles];

    // optimistic UI
    setRoles((prev) => prev.filter((r) => r._id !== id));

    try {
      await API.delete(`/roles/${id}`);
      toast.success("Role deleted ✅");
    } catch (error) {
      setRoles(original);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ================= ROWS =================
  const rows = useMemo(
    () =>
      roles.map((role, index) => (
        <tr
          key={role._id}
          className="group hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
        >
          {/* INDEX */}
          <td className="px-6 py-4 text-gray-400 text-sm">
            {index + 1}
          </td>

          {/* ROLE NAME */}
          <td className="px-6 py-4">
            <span className="px-6 py-4 text-gray-800 font-medium">
              {role.role_name}
            </span>
          </td>

          {/* CREATED */}
          <td className="px-6 py-4 text-gray-400 text-sm">
            {new Date(role.createdAt).toLocaleString()}
          </td>

          {/* ACTION */}
          <td className="px-6 py-4 text-center">
            <ActionDropdown
              onUpdate={() => updateRole(role._id)}
              onView={() => viewRole(role._id)}
              onDelete={() => deleteRole(role._id)}
            />
          </td>
        </tr>
      )),
    [roles]
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            
          </h3>
          <p className="text-sm text-gray-400">
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="p-6 text-gray-400 flex items-center gap-2">
          <AccessTimeIcon fontSize="small" />
          Loading roles...
        </div>
      )}

      {/* EMPTY */}
      {!loading && roles.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No roles found
        </div>
      )}

      {/* TABLE */}
      {!loading && roles.length > 0 && (
        <div className="">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>
                <th className="px-6 py-4 text-left text-gray-600">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>{rows}</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default RoleList;