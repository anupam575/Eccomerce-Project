"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../../../utils/axiosInstance";
import { toast } from "react-toastify";

const EditUser = () => {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "name", placeholder: "Full Name" },
    { name: "email", placeholder: "Email Address" },
  ];

  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles/all");
      if (res.data.success) setRoles(res.data.roles || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch roles");
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setForm({
        ...data.user,
        roleId: data.user?.role?._id || "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchRoles();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateRole = async () => {
    try {
      setLoading(true);

      await API.patch(`/users/${id}/role`, {
        roleId: form.roleId,
      });

      toast.success("Role updated successfully");
      router.push("/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating role");
    } finally {
      setLoading(false);
    }
  };

  if (!form._id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className=" flex items-center justify-center p-6">

      {/* CARD */}
      <div className="w-full m bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Edit User
        </h2>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                {field.placeholder}
              </label>

              <input
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="
                  w-full px-4 py-2.5
                  border border-gray-300 rounded-xl
                  outline-none
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500
                  transition
                  bg-gray-50 focus:bg-white
                "
              />
            </div>
          ))}

          {/* ACTIVE */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Active</label>
            <select
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              className="
                px-4 py-2.5 border rounded-xl
                focus:ring-2 focus:ring-blue-500
                outline-none transition
                bg-gray-50 focus:bg-white
              "
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          {/* BLOCKED */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Blocked</label>
            <select
              name="isBlocked"
              value={form.isBlocked}
              onChange={handleChange}
              className="
                px-4 py-2.5 border rounded-xl
                focus:ring-2 focus:ring-blue-500
                outline-none transition
                bg-gray-50 focus:bg-white
              "
            >
              <option value={false}>Not Blocked</option>
              <option value={true}>Blocked</option>
            </select>
          </div>

          {/* ROLE */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm text-gray-600 mb-1">Role</label>

            <select
              name="roleId"
              value={form.roleId || ""}
              onChange={handleChange}
              className="
                px-4 py-2.5 border rounded-xl
                focus:ring-2 focus:ring-blue-500
                outline-none transition
                bg-gray-50 focus:bg-white
              "
            >
              <option value="">Select Role</option>

              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => router.push("/users")}
            className="
              px-5 py-2 rounded-xl border
              hover:bg-gray-100 transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateRole}
            disabled={loading}
            className="
              px-6 py-2 rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700 transition
              disabled:opacity-60
            "
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditUser;