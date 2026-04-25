"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import UserSearch from "../../components/Section/searchUsers";
import UIPagination from "../../components/Section/UI/UIPagination";
import ActionDropdown from "../../components/Section/UI/ActionDropdown";

const Users = () => {
  const router = useRouter();

  // ✅ State
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // ✅ Fetch users
  const fetchUsers = useCallback(async (pageNumber = 1, query = "") => {
    try {
      setLoading(true);

      const url = query
        ? `/users/search?query=${encodeURIComponent(query)}`
        : `/users?page=${pageNumber}&limit=${limit}`;

      const { data } = await API.get(url);

      setUsers(data.users);
      setTotalUsers(data.totalUsers ?? data.users.length);
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error(
        "Fetch Users Error:",
        error.response?.data?.message || error.message
      );
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // ✅ Search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchUsers(page, debouncedQuery);
  }, [page, debouncedQuery, fetchUsers]);

  // ✅ Actions
  const handleUpdate = (id) => {
    router.push(`/admin/alluser/edit/${id}`);
  };

  const handleView = (id) => {
    router.push(`/admin/allusers/${id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      fetchUsers(page, debouncedQuery);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="text-xl font-semibold text-gray-800">
            Total Users: {totalUsers}
          </div>

          <div className="flex-1 max-w-md">
            <UserSearch onSearch={handleSearch} />
          </div>

          <button
            onClick={() => router.push("/admin/register")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            Add User
          </button>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Users List
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading users...
            </div>
          ) : (
            <>
              <div className="">
                <table className="w-full text-sm border-collapse">

                  {/* HEADER */}
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 border border-gray-200 text-left">ID</th>
                      <th className="px-6 py-3 border border-gray-200 text-left">Name</th>
                      <th className="px-6 py-3 border border-gray-200 text-left">Email</th>
                      <th className="px-6 py-3 border border-gray-200 text-left">Created</th>
                      <th className="px-6 py-3 border border-gray-200 text-center">Actions</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-gray-100 transition`}
                        >
                          <td className="px-6 py-4 border border-gray-200 text-gray-500 truncate max-w-[150px]">
                            {user._id}
                          </td>

                          <td className="px-6 py-4 border border-gray-200 font-medium text-gray-800">
                            {user.name}
                          </td>

                          <td className="px-6 py-4 border border-gray-200 text-gray-700">
                            {user.email}
                          </td>

                          <td className="px-6 py-4 border border-gray-200 text-gray-500">
                            {(() => {
                              const d = new Date(user.createdAt);
                              const day = String(d.getDate()).padStart(2, "0");
                              const month = String(d.getMonth() + 1).padStart(2, "0");
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            })()}
                          </td>

                          {/* ACTION */}
                          <td className="px-6 py-4 border border-gray-200 text-center">
                            <ActionDropdown
                              onUpdate={() => handleUpdate(user._id)}
                              onView={() => handleView(user._id)}
                              onDelete={() => handleDelete(user._id)}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">
                          No Users Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center mt-6">
                <UIPagination
                  totalPages={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;